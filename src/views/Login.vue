<template>
  <div class="auth-container">
    <div class="card auth-card">
      <div class="auth-header">
        <h2>Perpustakaan Digital</h2>
        <p class="subtitle">Silakan masuk untuk mengakses sistem</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="input-group">
          <label for="email">Alamat Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="contoh@email.com" 
            required 
          />
        </div>

        <div class="input-group">
          <label for="password">Kata Sandi</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="••••••••" 
            required 
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Memproses...' : 'Masuk ke Akun' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>Belum punya akun? <router-link to="/register" class="link-action">Daftar Sekarang</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import api from '../api/axios';

onMounted(() => {
  document.title = "Login";
});

const router = useRouter();
const email = ref('');
const password = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  try {
    const res = await api.post('auth/login', {
      email: email.value,
      password: password.value
    });
    
    localStorage.setItem('token', res.data.token || res.data.data?.token);
    alert("Login Berhasil!");
    router.push('/'); 
  } catch (err) {
    console.error(err);
    alert("Login Gagal: " + (err.response?.data?.message || "Email atau password salah."));
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped src="../assets/css/auth.css"></style>