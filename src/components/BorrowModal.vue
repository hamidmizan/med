<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>Pinjam Buku</h3>
      <p>Apakah anda yakin ingin meminjam buku ini?</p>
      <div class="actions">
        <button @click="$emit('confirm')" class="btn-confirm">Ya, Pinjam</button>
        <button @click="$emit('close')" class="btn-cancel">Batal</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close', 'confirm']);
</script>

<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
.modal-content { background: white; padding: 20px; border-radius: 8px; width: 300px; text-align: center; }
.actions { display: flex; gap: 10px; justify-content: center; margin-top: 20px; }
.btn-confirm { background: #3498db; color: white; border: none; padding: 8px 15px; cursor: pointer; border-radius: 4px; }
.btn-cancel { background: #ccc; border: none; padding: 8px 15px; cursor: pointer; border-radius: 4px; }
</style>