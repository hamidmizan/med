<template>
  <div class="borrowing-table-container">
    <table class="table">
      <thead>
        <tr>
          <th>Nama Siswa</th>
          <th>Buku</th>
          <th>Tanggal</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in borrowings" :key="item.id">
          <td>{{ item.user?.name }}</td>
          <td>{{ item.book?.title }}</td>
          <td>{{ formatDate(item.borrow_date) }}</td>
          <td>
            <span :class="['badge', item.status]">
              {{ item.status === 'borrowed' ? 'Dipinjam' : 'Kembali' }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { formatDate } from '../utils/formatDate';
defineProps({
  borrowings: Array
});
</script>

<style scoped>
.table { width: 100%; border-collapse: collapse; margin-top: 10px; }
.table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
.badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; }
.badge.borrowed { background: #ffebee; color: #c62828; }
.badge.returned { background: #e8f5e9; color: #2e7d32; }
</style>