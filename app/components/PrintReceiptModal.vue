<template>
  <div v-if="transaction" id="printable-receipt" class="hidden print:block">
    <div class="receipt-header">
      <h2 class="store-name">POS BOS</h2>
      <p class="store-address">Jl. Merdeka No. 123, Jakarta</p>
      <p class="store-phone">Telp: 0812-3456-7890</p>
    </div>

    <div class="receipt-divider"></div>

    <div class="receipt-info">
      <div class="info-row">
        <span>No. Nota:</span>
        <span>{{ transaction.invoice_number }}</span>
      </div>
      <div class="info-row">
        <span>Tanggal:</span>
        <span>{{ formatDate(transaction.created_at) }}</span>
      </div>
      <div class="info-row">
        <span>Kasir:</span>
        <span>{{ transaction.user_name || 'Kasir' }}</span>
      </div>
    </div>

    <div class="receipt-divider"></div>

    <div class="receipt-items">
      <div v-for="item in transaction.items" :key="item.id" class="item-block">
        <p class="item-name">{{ item.product_name || ('Produk #' + item.product_id) }}</p>
        <div class="item-calc">
          <span>{{ item.quantity }} x {{ formatCurrency(item.price) }}</span>
          <span>{{ formatCurrency(item.subtotal) }}</span>
        </div>
      </div>
    </div>

    <div class="receipt-divider"></div>

    <div class="receipt-total">
      <span>TOTAL</span>
      <span>{{ formatCurrency(transaction.total_amount) }}</span>
    </div>

    <div class="receipt-divider"></div>

    <div class="receipt-footer">
      <p>Terima Kasih Atas Kunjungan Anda</p>
      <p>Barang yang sudah dibeli tidak dapat dikembalikan</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Transaction } from '~/types/transaction.type'
import '~/assets/css/receipt-print.css'

defineProps<{
  transaction: Transaction | null
}>()

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>
