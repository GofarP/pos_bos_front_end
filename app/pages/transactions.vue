<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
        <p class="text-xs text-gray-500 mt-0.5">Daftar seluruh transaksi penjualan yang telah dilakukan</p>
      </div>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
      <div class="flex-1 min-w-[180px]">
        <label class="block text-xs font-semibold text-gray-600 mb-1">Tanggal Mulai</label>
        <input 
          v-model="startDate" 
          type="date" 
          class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
          @change="fetchTransactions(1)"
        />
      </div>
      <div class="flex-1 min-w-[180px]">
        <label class="block text-xs font-semibold text-gray-600 mb-1">Tanggal Selesai</label>
        <input 
          v-model="endDate" 
          type="date" 
          class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
          @change="fetchTransactions(1)"
        />
      </div>
      <button 
        v-if="startDate || endDate" 
        @click="resetFilter" 
        class="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        Reset Filter
      </button>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
      <p class="text-sm text-gray-500 font-medium animate-pulse">Memuat riwayat transaksi...</p>
    </div>

    <DataTable
      v-else
      :data="transactions"
      :columns="columns"
      :pagination="{
        currentPage: meta.page,
        totalPages: meta.total_pages,
        totalItems: meta.total_records,
        itemsPerPage: meta.limit
      }"
      @page-change="changePage"
    >
      <template #cell-no="{ index }">
        <span class="text-gray-500 text-xs">{{ (meta.page - 1) * meta.limit + index + 1 }}</span>
      </template>

      <template #cell-invoice_number="{ value }">
        <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-md font-mono">
          {{ value }}
        </span>
      </template>

      <template #cell-created_at="{ value }">
        <span class="text-sm text-gray-600">{{ formatDate(value) }}</span>
      </template>

      <template #cell-user_name="{ value }">
        <div class="flex items-center gap-1.5 text-sm text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          {{ value || 'Sistem' }}
        </div>
      </template>

      <template #cell-total_amount="{ value }">
        <span class="font-bold text-gray-900">{{ formatCurrency(value) }}</span>
      </template>

      <template #cell-status="{ value }">
        <span 
          v-if="value === 'CANCELLED'" 
          class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-50 text-red-600 border border-red-200"
        >
          Dibatalkan
        </span>
        <span 
          v-else 
          class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200"
        >
          Berhasil
        </span>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <button 
            @click="openDetailModal(row.id)"
            class="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            Detail
          </button>
          
          <button 
            v-if="row.status !== 'CANCELLED' && hasPermission('edit.transaction')"
            @click="handleCancelTransaction(row.id)"
            class="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors"
            title="Batalkan Transaksi"
          >
            Batalkan
          </button>
        </div>
      </template>
    </DataTable>

    <BaseModal 
      v-model="isDetailModalOpen" 
      title="Detail Transaksi" 
      size="lg"
    >
      <div v-if="isDetailLoading" class="flex flex-col items-center justify-center py-12">
        <div class="w-8 h-8 border-3 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
        <p class="text-xs text-gray-500">Memuat rincian transaksi...</p>
      </div>

      <div v-else-if="selectedTransaction" class="space-y-5">
        <div class="bg-gray-50 p-4 rounded-xl border border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <p class="text-gray-400 font-medium">No. Invoice</p>
            <p class="font-bold text-gray-800 font-mono mt-0.5">{{ selectedTransaction.invoice_number }}</p>
          </div>
          <div>
            <p class="text-gray-400 font-medium">Tanggal</p>
            <p class="font-semibold text-gray-800 mt-0.5">{{ formatDate(selectedTransaction.created_at) }}</p>
          </div>
          <div>
            <p class="text-gray-400 font-medium">Kasir</p>
            <p class="font-semibold text-gray-800 mt-0.5">{{ selectedTransaction.user_name || 'Sistem' }}</p>
          </div>
          <div>
            <p class="text-gray-400 font-medium">Status</p>
            <span 
              v-if="selectedTransaction.status === 'CANCELLED'" 
              class="inline-block mt-0.5 px-2 py-0.5 bg-red-100 text-red-700 font-bold rounded"
            >
              DIBATALKAN
            </span>
            <span 
              v-else 
              class="inline-block mt-0.5 px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded"
            >
              BERHASIL
            </span>
          </div>
        </div>

        <div>
          <h4 class="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Item Penjualan</h4>
          <div class="border border-gray-200 rounded-xl overflow-hidden">
            <table class="w-full text-left text-xs">
              <thead class="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                <tr>
                  <th class="px-3 py-2.5">No</th>
                  <th class="px-3 py-2.5">Produk</th>
                  <th class="px-3 py-2.5">Harga</th>
                  <th class="px-3 py-2.5 text-center">Jumlah</th>
                  <th class="px-3 py-2.5 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(item, idx) in selectedTransaction.items" :key="item.id" class="hover:bg-gray-50/50">
                  <td class="px-3 py-2.5 text-gray-400">{{ idx + 1 }}</td>
                  <td class="px-3 py-2.5 font-medium text-gray-800">
                    <div>{{ item.product_name || `Produk #${item.product_id}` }}</div>
                    <span v-if="item.product_sku" class="text-[10px] text-gray-400 font-mono">{{ item.product_sku }}</span>
                  </td>
                  <td class="px-3 py-2.5 text-gray-600">{{ formatCurrency(item.price) }}</td>
                  <td class="px-3 py-2.5 text-center font-bold text-gray-800">{{ item.quantity }}</td>
                  <td class="px-3 py-2.5 text-right font-bold text-indigo-600">{{ formatCurrency(item.subtotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex justify-between items-center pt-3 border-t border-gray-100">
          <span class="text-sm font-bold text-gray-700">Total Pembayaran</span>
          <span class="text-lg font-extrabold text-indigo-600">{{ formatCurrency(selectedTransaction.total_amount) }}</span>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between items-center w-full">
          <Button 
            v-if="selectedTransaction?.status !== 'CANCELLED' && hasPermission('edit.transaction')"
            type="button" 
            color="red" 
            @click="handleCancelTransaction(selectedTransaction.id)"
            :disabled="isCancelling"
          >
            {{ isCancelling ? 'Membatalkan...' : 'Batalkan Transaksi' }}
          </Button>
          <div v-else></div>

          <div class="flex items-center gap-2">
            <Button type="button" color="green" @click="printReceipt" class="gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M3 9.456c0-1.081.768-2.015 1.837-2.175a48.049 48.049 0 0 1 1.913-.247m0 0a48.1 48.1 0 0 1 14.5 0m-14.5 0V5.25A2.25 2.25 0 0 1 9 3h6a2.25 2.25 0 0 1 2.25 2.25v2.706m-14.5 0c-.24.03-.48.062-.72.096" />
              </svg>
              Cetak Struk
            </Button>
            <Button type="button" color="gray" @click="closeDetailModal">
              Tutup
            </Button>
          </div>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTransactions } from '~/composables/useTransactions'
import { useAuthUser } from '~/composables/useAuthUser'
import { printThermalReceipt } from '~/utils/receiptPrinter'

definePageMeta({ layout: 'default' })
useHead({ title: 'Riwayat Transaksi — POS BOS' })

const { hasPermission } = useAuthUser()

const {
  transactions,
  isLoading,
  isDetailLoading,
  isCancelling,
  isDetailModalOpen,
  selectedTransaction,
  startDate,
  endDate,
  meta,
  fetchTransactions,
  changePage,
  openDetailModal,
  closeDetailModal,
  handleCancelTransaction,
  formatCurrency,
  formatDate
} = useTransactions()

const columns = [
  { key: 'no', label: 'No' },
  { key: 'invoice_number', label: 'No. Invoice' },
  { key: 'created_at', label: 'Tanggal & Waktu' },
  { key: 'user_name', label: 'Kasir' },
  { key: 'total_amount', label: 'Total Pembayaran' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Aksi' }
]

const resetFilter = () => {
  startDate.value = ''
  endDate.value = ''
  fetchTransactions(1)
}

const printReceipt = (size: '58mm' | '80mm' = '80mm') => {
  if (selectedTransaction.value) {
    printThermalReceipt(selectedTransaction.value, size)
  }
}

onMounted(() => {
  fetchTransactions()
})
</script>
