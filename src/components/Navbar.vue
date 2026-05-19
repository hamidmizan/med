<template>
  <nav v-if="showNavbar" class="navbar">
    <h2 @click="$router.push('/')" class="nav-brand">SmartLibrary</h2>
    
    <button @click="logout" class="btn-logout">
      Logout
    </button>
  </nav>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";
import api from "../api/axios";
const router = useRouter();
const route = useRoute();

const showNavbar = computed(() => {
  return route.path !== "/login" && route.path !== "/register";
});

const logout = async () => {
  if (confirm("Yakin ingin logout?")) {
    try {
      await api.post("auth/logout");
    } catch (err) {
      console.error("Gagal logout ke server, membersihkan storage lokal...", err);
    } finally {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }
};
</script>

<style scoped>
.navbar { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 1rem 2rem; 
  background-color: #2c3e50; /* Warna biru gelap senada dengan tema buku */
  color: white; 
  font-family: sans-serif;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-brand {
  margin: 0;
  font-size: 1.5rem;
  cursor: pointer;
  user-select: none;
}

.btn-logout { 
  background-color: #e74c3c; /* Warna merah standard tombol hapus/kembalikan */
  color: white; 
  border: none; 
  padding: 8px 16px; 
  cursor: pointer; 
  border-radius: 4px; 
  font-weight: bold;
  transition: background-color 0.2s;
}

.btn-logout:hover {
  background-color: #c0392b;
}
</style>