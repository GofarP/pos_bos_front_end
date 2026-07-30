<template>
  <div>
    <NuxtLayout v-if="errorConfig.useLayout" name="default">
      <div class="flex flex-col items-center justify-center py-28 text-center h-full">
        <div :class="['p-6 rounded-full mb-6', errorConfig.bgClass]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" :class="['w-16 h-16', errorConfig.iconClass]">
            <path stroke-linecap="round" stroke-linejoin="round" :d="errorConfig.iconPath" />
          </svg>
        </div>

        <h1 class="text-6xl font-extrabold text-gray-900 tracking-tight mb-2">{{ errorConfig.statusCode }}</h1>
        <h2 class="text-2xl font-bold text-gray-800 mb-3">{{ errorConfig.title }}</h2>
        <p class="text-gray-500 mb-8 max-w-md leading-relaxed">{{ errorConfig.description }}</p>

        <Button color="green" class="px-8 py-2.5 shadow-md" @click="handleError">
          Kembali ke Beranda
        </Button>
      </div>
    </NuxtLayout>

    <div v-else class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div class="bg-red-50 p-6 rounded-full mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 text-red-500">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <h1 class="text-7xl font-extrabold text-red-500 tracking-tight mb-4">{{ errorConfig.statusCode }}</h1>
      <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ errorConfig.title }}</h2>
      <p class="text-gray-600 mb-8 max-w-lg text-lg leading-relaxed">{{ errorConfig.description }}</p>
      
      <div class="flex gap-4">
        <Button color="gray" class="px-6 shadow-sm" @click="reloadPage">
          Muat Ulang Halaman
        </Button>
        <Button color="red" class="px-8 shadow-md" @click="handleError">
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NuxtError } from '#app'
import { clearError } from '#imports'

const props = defineProps<{
  error: NuxtError
}>()

const errorConfig = computed(() => {
  const code = props.error?.statusCode || 500
  const customMessage = props.error?.message || props.error?.statusMessage

  if (code === 404) {
    return {
      statusCode: 404,
      title: 'Halaman Tidak Ditemukan',
      description: customMessage && customMessage !== '404'
        ? customMessage 
        : 'Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.',
      bgClass: 'bg-emerald-50',
      iconClass: 'text-emerald-500',
      iconPath: 'M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59',
      useLayout: true
    }
  }

  if (code === 403) {
    return {
      statusCode: 403,
      title: 'Akses Ditolak',
      description: customMessage && customMessage !== '403'
        ? customMessage 
        : 'Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.',
      bgClass: 'bg-amber-50',
      iconClass: 'text-amber-500',
      iconPath: 'M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636',
      useLayout: true
    }
  }

  return {
    statusCode: code,
    title: 'Terjadi Kesalahan Server',
    description: customMessage || 'Sistem sedang mengalami gangguan. Silakan coba beberapa saat lagi.',
    bgClass: 'bg-red-50',
    iconClass: 'text-red-500',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    useLayout: false
  }
})

const handleError = () => clearError({ redirect: '/' })

const reloadPage = () => {
  window.location.reload()
}
</script>
