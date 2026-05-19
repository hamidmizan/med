<template>
  <div class="auth-container">
    <div class="card auth-card">
      <div class="auth-header">
        <h2>Buat Akun Baru</h2>
        <p class="subtitle">Silakan isi formulir pendaftaran anggota</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="input-group">
          <label for="name">Nama Lengkap</label>
          <input 
            type="text" 
            id="name" 
            v-model="name" 
            placeholder="Masukkan nama lengkap..." 
            required 
          />
        </div>

        <div class="input-group">
          <label for="email">Alamat Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="contoh@mail.com" 
            required 
          />
        </div>

        <div class="input-group">
          <label for="password">Kata Sandi</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="Minimal 6 karakter" 
            required 
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>Sudah punya akun? <router-link to="/login" class="link-action">Masuk di sini</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';
import { onMounted } from 'vue';

onMounted(() => {
  document.title = "Register";
});

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  isLoading.value = true;
  try {
    await api.post('auth/register', {
      name: name.value,
      email: email.value,
      password: password.value
    });
    
    alert("Registrasi Berhasil! Silakan masuk dengan akun baru.");
    router.push('/login');
  } catch (err) {
    console.error(err);
    alert("Registrasi Gagal: " + (err.response?.data?.message || "Periksa kembali format data."));
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped src="../assets/css/auth.css"></style>