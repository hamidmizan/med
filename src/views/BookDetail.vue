<template>
  <div v-if="book" class="container">
    <button @click="$router.push('/')" class="btn-back">← Kembali ke Dashboard</button>

    <div class="detail-grid">
      <div class="card info-card">
        <div class="editable-header">
          <label class="edit-hint">Klik judul di bawah untuk mengedit / kosongkan lalu Enter untuk menghapus:</label>
          <h1 v-if="!isEditing" @click="enableEdit" title="Klik untuk edit" class="book-title">
            {{ book.title }}
          </h1>
          <input 
            v-else 
            v-model="editTitle" 
            @keyup.enter="handleUpdateOrDelete" 
            @blur="isEditing = false"
            ref="titleInput"
            class="input-edit"
            placeholder="Kosongkan lalu Enter untuk hapus buku"
          />
          <p class="subtitle">Penulis: {{ book.author }}</p>
          <span class="category-badge">{{ book.category?.name || 'Tanpa Kategori' }}</span>
        </div>
        
        <div class="stock-info">
          <p>Stok Tersedia: <strong>{{ book.stock }}</strong></p>
        </div>

        <button class="btn-borrow" @click="borrowBook" :disabled="book.stock <= 0">
          {{ book.stock > 0 ? 'Pinjam Buku Ini' : 'Stok Habis' }}
        </button>
      </div>

      <div class="card chart-card">
        <h3>Ringkasan Peminjaman</h3>
        <div class="chart-wrapper">
          <canvas ref="canvasRef"></canvas>
        </div>
      </div>
    </div>

    <div class="card history-section">
      <div class="section-header">
        <h3>Riwayat Peminjaman Buku</h3>
        <div class="filter-group">
          <label>Bulan:</label>
          <select v-model="filterMonth">
            <option value="all">Semua Bulan</option>
            <option v-for="(m, index) in months" :key="index" :value="index">{{ m }}</option>
          </select>

          <label style="margin-left: 15px;">Tahun:</label>
          <select v-model="filterYear">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Tanggal Pinjam</th>
            <th>Nama Anggota</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredBorrowings.length === 0">
            <td colspan="4" style="text-align: center; color: #999;">Tidak ada data peminjaman yang cocok dengan filter.</td>
          </tr>
          <tr v-for="loan in filteredBorrowings" :key="loan.id">
            <td>{{ formatDate(loan.borrow_date || loan.created_at) }}</td>
            <td>{{ loan.user?.name || 'Anggota Perpustakaan' }}</td>
            <td>
              <span :class="['status-badge', loan.status]">
                {{ loan.status === 'borrowed' ? 'Dipinjam' : 'Dikembalikan' }}
              </span>
            </td>
            <td>
              <button 
                v-if="loan.status === 'borrowed'" 
                @click="returnBook(loan.id)" 
                class="btn-return"
              >
                Kembalikan Buku
              </button>
              <span v-else class="text-muted">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-else class="loading-state">
    Memuat data detail buku...
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api/axios';
import Chart from 'chart.js/auto';

const route = useRoute();
const router = useRouter();

const book = ref(null);
const borrowings = ref([]);
const isEditing = ref(false);
const editTitle = ref("");
const titleInput = ref(null);

const canvasRef = ref(null);
let chartInstance = null;

const filterYear = ref(new Date().getFullYear());
const filterMonth = ref("all");

const years = Array.from({ length: 16 }, (_, i) => 2015 + i);
const months = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const fetchBookDetail = async () => {
  try {
    const resBook = await api.get(`books/${route.params.bookId}`);
    book.value = resBook.data.data;
    editTitle.value = book.value.title;
    
    document.title = `Detail - ${book.value.title}`;

    const resBorrowings = await api.get('borrowings');
    const allLoans = resBorrowings.data.data?.data || resBorrowings.data.data || [];
    
    borrowings.value = allLoans.filter(loan => {
      return parseInt(loan.book_id) === parseInt(route.params.bookId);
    });

    await nextTick();
    renderChart();
  } catch (err) {
    console.error("Gagal mengambil detail buku:", err);
  }
};

const borrowBook = async () => {
  try {
    const targetBookId = book.value?.id || route.params.bookId;
    const today = new Date().toISOString().split('T')[0];

    await api.post('borrowings', {
      book_id: parseInt(targetBookId),
      borrow_date: today
    });
    
    alert("Buku Berhasil Dipinjam!");
    fetchBookDetail(); 
  } catch (err) {
    alert("Gagal meminjam buku: " + (err.response?.data?.message || "Stok habis"));
  }
};

const returnBook = async (loanId) => {
  if (!loanId) return;
  try {
    await api.put(`borrowings/${loanId}/return`, { status: 'returned' });
    alert("Buku Berhasil Dikembalikan!");
    fetchBookDetail(); 
  } catch (err) {
    console.error(err);
  }
};

const enableEdit = () => {
  isEditing.value = true;
  nextTick(() => titleInput.value.focus());
};

const handleUpdateOrDelete = async () => {
  if (editTitle.value.trim() === "") {
    if (confirm(`Apakah Anda yakin ingin menghapus buku dari sistem?`)) {
      try {
        await api.delete(`books/${book.value.id}`);
        alert("Buku berhasil dihapus.");
        router.push('/'); 
      } catch (err) {
        alert("Gagal menghapus buku. Buku ini kemungkinan memiliki relasi transaksi.");
        editTitle.value = book.value.title;
        isEditing.value = false;
      }
    } else {
      editTitle.value = book.value.title;
      isEditing.value = false;
    }
  } else {
    try {
      await api.put(`books/${book.value.id}`, { 
        title: editTitle.value,
        author: book.value.author,
        year: book.value.year,
        category_id: book.value.category_id
      });
      book.value.title = editTitle.value;
      isEditing.value = false;
      alert("Judul buku berhasil diperbarui!");
    } catch (err) {
      console.error(err);
    }
  }
};

const renderChart = () => {
  if (!canvasRef.value) return;
  if (chartInstance) chartInstance.destroy();

  const borrowed = borrowings.value.filter(b => b.status === 'borrowed').length;
  const returned = borrowings.value.filter(b => b.status === 'returned').length;

  chartInstance = new Chart(canvasRef.value, {
    type: 'doughnut',
    data: {
      labels: ['Dipinjam', 'Dikembalikan'],
      datasets: [{ data: [borrowed, returned], backgroundColor: ['#ff4d4d', '#2ecc71'] }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  });
};

const filteredBorrowings = computed(() => {
  if (!borrowings.value) return [];
  return borrowings.value.filter(b => {
    const dateStr = b.borrow_date || b.created_at;
    if (!dateStr) return false;
    
    const loanDate = new Date(dateStr);
    const matchYear = loanDate.getFullYear() === parseInt(filterYear.value);
    const matchMonth = filterMonth.value === "all" || loanDate.getMonth() === parseInt(filterMonth.value);
    
    return matchYear && matchMonth;
  });
});

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

onMounted(fetchBookDetail);
</script>

<style scoped src="../assets/css/book-detail.css"></style>