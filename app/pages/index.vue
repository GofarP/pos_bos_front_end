<template>
  <div class="w-full max-w-6xl p-6 sm:p-8 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-6 relative">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-3xl font-bold text-emerald-900 mb-2">Dashboard Utama</h1>
        <p class="text-sm text-gray-500">Ringkasan aktivitas hari ini.</p>
      </div>
      
      <Button color="green" @click="fetchSummary" variant="soft" size="sm" class="gap-2" :disabled="isLoading">
        <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        Refresh
      </Button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="p-6 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
        <div class="absolute right-0 top-0 opacity-10 group-hover:opacity-20 transition-opacity translate-x-1/4 -translate-y-1/4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-24 h-24 text-emerald-600">
            <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
            <path fill-rule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clip-rule="evenodd" />
            <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
          </svg>
        </div>
        <h3 class="text-sm font-medium text-emerald-800">Total Penjualan</h3>
        <p class="text-3xl font-bold text-emerald-950 mt-2">{{ isLoading ? '...' : formatCurrency(summary.total_sales) }}</p>
      </div>
      
      <div class="p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
        <div class="absolute right-0 top-0 opacity-10 group-hover:opacity-20 transition-opacity translate-x-1/4 -translate-y-1/4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-24 h-24 text-blue-600">
            <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
          </svg>
        </div>
        <h3 class="text-sm font-medium text-blue-800">Pesanan Baru</h3>
        <p class="text-3xl font-bold text-blue-950 mt-2">{{ isLoading ? '...' : summary.new_orders }}</p>
      </div>
      
      <div class="p-6 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
        <div class="absolute right-0 top-0 opacity-10 group-hover:opacity-20 transition-opacity translate-x-1/4 -translate-y-1/4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-24 h-24 text-indigo-600">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </div>
        <h3 class="text-sm font-medium text-indigo-800">Produk Terjual</h3>
        <p class="text-3xl font-bold text-indigo-950 mt-2">{{ isLoading ? '...' : summary.products_sold }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { transactionService } from '~/utils/transaction.service'
import type { DashboardSummary } from '~/types/transaction.type'

const isLoading = ref(true)
const summary = ref<DashboardSummary>({
  total_sales: 0,
  new_orders: 0,
  products_sold: 0
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
}

const fetchSummary = async () => {
  isLoading.value = true
  try {
    const res = await transactionService.getDashboardSummary()
    summary.value = res.data
  } catch (error) {
    console.error('Failed to fetch dashboard summary', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchSummary()
})

useHead({
  title: 'Dashboard'
})
</script>
