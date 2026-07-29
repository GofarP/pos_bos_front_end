<template>
  <div>
    <!-- Tampilan 404 (Di dalam layout dengan Sidebar) -->
    <NuxtLayout v-if="error.statusCode === 404" name="default">
      <div class="flex flex-col items-center justify-center py-32 text-center h-full">
        <div class="bg-emerald-50 p-6 rounded-full mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-emerald-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
          </svg>
        </div>
        <h1 class="text-6xl font-extrabold text-gray-900 tracking-tight mb-2">404</h1>
        <h2 class="text-2xl font-bold text-gray-800 mb-3">Halaman Tidak Ditemukan</h2>
        <p class="text-gray-500 mb-8 max-w-md">Maaf, halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau Anda salah mengetikkan alamat URL-nya.</p>
        <Button color="green" class="px-8 py-2.5 shadow-md" @click="handleError">
          Kembali ke Beranda
        </Button>
      </div>
    </NuxtLayout>

    <!-- Tampilan 500 / Error Lainnya (Fullscreen) -->
    <div v-else class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div class="bg-red-50 p-6 rounded-full mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 text-red-500">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 class="text-7xl font-extrabold text-red-500 tracking-tight mb-4">{{ error.statusCode || '500' }}</h1>
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Terjadi Kesalahan Server</h2>
      <p class="text-gray-600 mb-8 max-w-lg text-lg">
        {{ error.message || 'Sistem kami sedang mengalami gangguan. Mohon maaf atas ketidaknyamanan ini, silakan coba lagi dalam beberapa saat.' }}
      </p>
      
      <div class="flex gap-4">
        <Button color="gray" class="px-6 shadow-sm" @click="reloadPage">
          Muat Ulang Halaman
        </Button>
        <Button color="red" class="px-8 shadow-md" @click="handleError">
          Kembali ke Beranda
        </Button>
      </div>
      
      <!-- Tech details only visible in dev, maybe helpful for debugging -->
      <div v-if="error.stack" class="mt-12 text-left bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-full max-w-4xl overflow-x-auto">
        <h3 class="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Detail Error (Hanya Developer)</h3>
        <pre class="text-xs text-red-600 font-mono">{{ error.stack }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: {
    type: Object as () => NuxtError,
    required: true
  }
})

// Fungsi untuk me-reset state error dan kembali ke halaman utama (home)
const handleError = () => clearError({ redirect: '/' })

// Fungsi untuk sekadar merefresh browser
const reloadPage = () => {
  window.location.reload()
}
</script>
