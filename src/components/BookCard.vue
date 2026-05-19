<template>
  <div class="book-card" @click="$router.push(`/books/${book.id}`)">
    <h3>{{ book.title }}</h3>
    <p class="author">{{ book.author }}</p>
    <div class="footer">
      <span class="category">{{ book.category?.name }}</span>
      <span class="stock">Stok: {{ book.stock }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  book: Object
});
</script>

<style scoped>
.book-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #eee;
  cursor: pointer;
  transition: transform 0.2s;
}
.book-card:hover { transform: translateY(-5px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.author { color: #666; font-size: 0.9rem; margin: 5px 0; }
.footer { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
.category { background: #e3f2fd; color: #1976d2; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; }
.stock { font-size: 0.8rem; font-weight: bold; }
</style>