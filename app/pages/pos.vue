<template>
  <div class="pos-container">
    <div class="pos-catalog" :class="{ 'mobile-hidden': mobileTab === 'cart' }">
      <div class="catalog-header">
        <div>
          <h1 class="catalog-title">Kasir POS</h1>
          <p class="catalog-subtitle">Pilih produk untuk ditambahkan ke keranjang</p>
        </div>
        <div class="catalog-badge">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="badge-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
          </svg>
          <span>{{ products.length }} Produk</span>
        </div>
      </div>

      <div class="search-bar">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="search-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Cari produk, SKU..." class="search-input" />
        <button v-if="searchQuery" @click="searchQuery = ''" class="search-clear">✕</button>
      </div>

      <div v-if="isLoadingProducts" class="loading-state">
        <div class="spinner"></div>
        <p>Memuat produk...</p>
      </div>

      <div v-else-if="products.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="empty-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <p class="empty-title">Produk tidak ditemukan</p>
        <p class="empty-sub">Coba kata kunci yang berbeda</p>
      </div>

      <div v-else class="product-grid-wrapper">
        <div class="product-grid">
          <button
            v-for="product in products" :key="product.id"
            @click="addToCart(product)"
            class="product-card" :class="{ 'out-of-stock': product.stock <= 0 }"
            :disabled="product.stock <= 0"
          >
            <div class="stock-badge" :class="product.stock <= 5 ? 'low-stock' : 'in-stock'">Stok: {{ product.stock }}</div>
            <div class="product-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <div class="product-info">
              <p class="product-name">{{ product.name }}</p>
              <p v-if="product.sku" class="product-sku">{{ product.sku }}</p>
            </div>
            <p class="product-price">{{ formatCurrency(product.price) }}</p>
            <div v-if="product.stock <= 0" class="out-label">Habis</div>
          </button>
        </div>
        <div class="load-more-area">
          <button v-if="hasMore" @click="loadMore" :disabled="isLoadingMore" class="load-more-btn">
            <span v-if="isLoadingMore" class="load-more-spinner"></span>
            <span>{{ isLoadingMore ? 'Memuat...' : 'Muat Lebih Banyak' }}</span>
          </button>
          <p v-else class="load-more-end">✓ Semua produk telah ditampilkan</p>
        </div>
      </div>
    </div>

    <div class="pos-cart" :class="{ 'mobile-hidden': mobileTab === 'products' }">
      <div class="cart-header">
        <div class="cart-title-area">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="cart-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          <div>
            <h2 class="cart-title">Keranjang</h2>
            <p class="cart-count">{{ cartCount }} item</p>
          </div>
        </div>
        <button v-if="cart.length > 0" @click="clearCart" class="clear-cart-btn">Kosongkan</button>
      </div>

      <div class="cart-items" v-if="cart.length > 0">
        <div v-for="item in cart" :key="item.product_id" class="cart-item">
          <div class="cart-item-info">
            <p class="cart-item-name">{{ item.name }}</p>
            <p class="cart-item-price">{{ formatCurrency(item.price) }} / pcs</p>
          </div>
          <div class="cart-item-controls">
            <button @click="updateQuantity(item.product_id, item.quantity - 1)" class="qty-btn minus">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" /></svg>
            </button>
            <span class="qty-value">{{ item.quantity }}</span>
            <button @click="updateQuantity(item.product_id, item.quantity + 1)" class="qty-btn plus">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </button>
          </div>
          <div class="cart-item-subtotal">
            <p>{{ formatCurrency(item.subtotal) }}</p>
            <button @click="removeFromCart(item.product_id)" class="remove-btn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="cart-empty">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="cart-empty-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
        <p class="cart-empty-title">Keranjang kosong</p>
        <p class="cart-empty-sub">Klik produk di sebelah kiri untuk menambahkan</p>
      </div>

      <div class="cart-summary">
        <div class="summary-row">
          <span class="summary-label">Subtotal ({{ cartCount }} item)</span>
          <span class="summary-value">{{ formatCurrency(cartTotal) }}</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-total-row">
          <span class="summary-total-label">Total Pembayaran</span>
          <span class="summary-total-value">{{ formatCurrency(cartTotal) }}</span>
        </div>
        <button @click="processTransaction" :disabled="cart.length === 0 || isProcessing" class="pay-btn">
          <span v-if="isProcessing" class="pay-spinner"></span>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="pay-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
          </svg>
          {{ isProcessing ? 'Memproses...' : 'Bayar Sekarang' }}
        </button>
      </div>
    </div>

    <div class="mobile-tab-bar">
      <button class="tab-btn" :class="{ active: mobileTab === 'products' }" @click="mobileTab = 'products'">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="tab-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
        </svg>
        <span>Produk</span>
      </button>
      <button class="tab-btn" :class="{ active: mobileTab === 'cart' }" @click="mobileTab = 'cart'">
        <div class="tab-cart-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="tab-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </div>
        <span>Keranjang</span>
      </button>
    </div>

    <Teleport to="body">
      <Transition name="receipt-fade">
        <div v-if="showReceipt" class="receipt-overlay" @click.self="closeReceipt">
          <div class="receipt-modal">
            <div class="receipt-success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h3 class="receipt-title">Transaksi Berhasil!</h3>
            <p class="receipt-invoice">No. Nota: <strong>{{ lastTransaction?.invoice_number }}</strong></p>
            <div class="receipt-items" v-if="lastTransaction?.items?.length">
              <div v-for="item in lastTransaction.items" :key="item.id" class="receipt-item">
                <span>{{ item.quantity }}x</span>
                <span class="receipt-item-name">Produk #{{ item.product_id }}</span>
                <span>{{ formatCurrency(item.subtotal) }}</span>
              </div>
            </div>
            <div class="receipt-divider"></div>
            <div class="receipt-total">
              <span>Total</span>
              <span class="receipt-total-amount">{{ formatCurrency(lastTransaction?.total_amount || 0) }}</span>
            </div>
            <div class="receipt-actions">
              <button @click="printReceipt" class="receipt-print-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M3 9.456c0-1.081.768-2.015 1.837-2.175a48.049 48.049 0 0 1 1.913-.247m0 0a48.1 48.1 0 0 1 14.5 0m-14.5 0V5.25A2.25 2.25 0 0 1 9 3h6a2.25 2.25 0 0 1 2.25 2.25v2.706m-14.5 0c-.24.03-.48.062-.72.096" />
                </svg>
                Cetak Struk
              </button>
              <button @click="closeReceipt" class="receipt-close-btn">Transaksi Baru</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <PrintReceiptModal :transaction="lastTransaction" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePos } from '~/composables/usePos'
import { printThermalReceipt } from '~/utils/receiptPrinter'
import '~/assets/css/pos.css'

definePageMeta({ layout: 'default' })
useHead({ title: 'Kasir (POS) — POS BOS' })

const mobileTab = ref<'products' | 'cart'>('products')

const {
  products, cart, searchQuery,
  isLoadingProducts, isLoadingMore, isProcessing,
  hasMore, showReceipt, lastTransaction,
  cartTotal, cartCount,
  fetchProducts, loadMore,
  addToCart, updateQuantity, removeFromCart, clearCart,
  formatCurrency, processTransaction, closeReceipt
} = usePos()

const printReceipt = (size: '58mm' | '80mm' = '80mm') => {
  if (lastTransaction.value) {
    printThermalReceipt(lastTransaction.value, size)
  }
}

onMounted(() => fetchProducts())
</script>
