<template>
  <div class="dashboard">
    <h1>Selamat Datang di SmartLibrary</h1>
    
    <div class="stats-grid">
      <div class="card chart-card">
        <h3>Statistik Peminjaman</h3>
        <div class="chart-wrapper" style="position: relative; height: 220px; width: 100%;">
          <canvas ref="dashboardChartRef"></canvas>
        </div>
      </div>

      <div class="card info-card">
        <h3>Ringkasan</h3>
        <div class="stat-item">
          <span>Total Buku:</span>
          <strong>{{ books.length }}</strong>
        </div>
        <div class="stat-item">
          <span>Peminjaman Aktif:</span>
          <strong>{{ activeBorrowingsCount }}</strong>
        </div>
      </div>
    </div>

    <div class="add-book">
      <button @click="showForm = !showForm" class="btn-toggle"> 
        {{ showForm ? 'Batal' : '+ Tambah Buku' }} 
      </button>
      
      <form v-if="showForm" @submit.prevent="addBook" class="form-container">
        <div class="form-group">
          <input v-model="newBook.title" placeholder="Judul Buku" required>
        </div>
        <div class="form-group">
          <input v-model="newBook.author" placeholder="Penulis" required>
        </div>
        <div class="form-group">
          <input v-model="newBook.year" type="number" placeholder="Tahun Terbit" required>
        </div>
        <div class="form-group">
          <select v-model="newBook.category_id" required>
            <option value="" disabled selected>Pilih Kategori ID</option>
            <option value="1">Kategori 1</option>
            <option value="2">Kategori 2</option>
            <option value="3">Kategori 3</option>
          </select>
        </div>
        <button type="submit" class="btn-submit">Simpan Buku</button>
      </form>
    </div>

    <div class="data-section">
      <h2>Daftar Buku Terbaru</h2>
      <div v-if="loading" class="loading">Memuat daftar buku...</div>
      <div v-else class="book-grid">
        <div v-for="book in books" :key="book.id" class="book-item" @click="$router.push(`/books/${book.id}`)">
          <h4>{{ book.title }}</h4>
          <p>{{ book.author }} ({{ book.year }})</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from "vue";
import api from "../api/axios";
import Chart from "chart.js/auto";

const books = ref([]);
const borrowings = ref([]);
const loading = ref(true);
const showForm = ref(false);

const dashboardChartRef = ref(null);
let dashboardChartInstance = null;

const newBook = ref({
  title: "",
  author: "",
  year: new Date().getFullYear(),
  category_id: ""
});

const activeBorrowingsCount = computed(() => {
  return borrowings.value.filter(b => b.status === 'borrowed').length;
});

const renderDashboardChart = async () => {
  await nextTick();
  if (!dashboardChartRef.value) return;
  if (dashboardChartInstance) {
    dashboardChartInstance.destroy();
  }

  const totalBooks = books.value.length;
  const totalBorrowed = activeBorrowingsCount.value;

  dashboardChartInstance = new Chart(dashboardChartRef.value, {
    type: 'bar',
    data: {
      labels: ['Total Buku', 'Sedang Dipinjam'],
      datasets: [{
        label: 'Jumlah',
        data: [totalBooks, totalBorrowed],
        backgroundColor: ['#3498db', '#e74c3c']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  });
};

const addBook = async () => {
  try {
    await api.post("/books", {
      title: newBook.value.title,
      author: newBook.value.author,
      year: parseInt(newBook.value.year),
      category_id: parseInt(newBook.value.category_id),
      stock: 10
    });
    
    alert("Buku Berhasil Ditambahkan!");
    newBook.value = { title: "", author: "", year: 2026, category_id: "" };
    showForm.value = false;
    fetchData(); 
  } catch (err) {
    console.error(err);
  }
};

const fetchData = async () => {
  loading.value = true;
  try {
    const [resBooks, resBorrowings] = await Promise.all([
      api.get("/books"),
      api.get("/borrowings")
    ]);
    books.value = resBooks.data.data;
    borrowings.value = resBorrowings.data.data.data || resBorrowings.data.data;
    
    renderDashboardChart();
  } catch (err) {
    console.error("Gagal mengambil data:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>

<style scoped src="../assets/css/dashboard.css"></style>