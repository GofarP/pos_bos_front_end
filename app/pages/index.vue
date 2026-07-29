<template>
  <div class="w-full max-w-6xl p-6 sm:p-8 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-3xl font-bold text-emerald-900 mb-2">Dashboard Utama</h1>
        <p class="text-sm text-gray-500">Ringkasan aktivitas hari ini.</p>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Card Skeleton 1 -->
      <div class="p-6 bg-gray-50 rounded-xl border border-gray-100">
        <h3 class="text-sm font-medium text-gray-500">Total Penjualan</h3>
        <p class="text-3xl font-bold text-emerald-900 mt-2">Rp 0</p>
      </div>
      <!-- Card Skeleton 2 -->
      <div class="p-6 bg-gray-50 rounded-xl border border-gray-100">
        <h3 class="text-sm font-medium text-gray-500">Pesanan Baru</h3>
        <p class="text-3xl font-bold text-emerald-900 mt-2">0</p>
      </div>
      <!-- Card Skeleton 3 -->
      <div class="p-6 bg-gray-50 rounded-xl border border-gray-100">
        <h3 class="text-sm font-medium text-gray-500">Produk Terjual</h3>
        <p class="text-3xl font-bold text-emerald-900 mt-2">0</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page metadata defaults to 'default' layout

useHead({
  title: 'Dashboard'
})
</script>
