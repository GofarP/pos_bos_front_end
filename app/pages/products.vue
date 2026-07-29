<template>
  <div class="space-y-6">
    <!-- Header & Action -->
    <div class="flex justify-between items-center gap-4">
      <h1 class="text-2xl font-bold text-gray-900">Manajemen Produk</h1>
    </div>

    <!-- Search Bar -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 sm:items-center">
      <div class="flex-1 w-full relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <Input 
          v-model="searchQuery" 
          placeholder="Cari nama atau SKU produk..."
          class="!pl-10"
        />
      </div>
    </div>

    <!-- Action Button -->
    <div class="flex justify-end" v-if="hasPermission('create.product')">
      <Button color="green" @click="openAddModal" class="gap-2 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Tambah Produk
      </Button>
    </div>

    <!-- Data Table -->
    <DataTable
      :columns="columns"
      :data="products"
      :loading="isLoading"
      :currentPage="currentPage"
      :totalPages="totalPages"
      :totalItems="totalItems"
      :limit="limit"
      @page-change="fetchProducts"
    >
      <template #cell-no="{ index }">
        <span class="text-gray-500">{{ (currentPage - 1) * limit + index + 1 }}</span>
      </template>

      <template #cell-name="{ row }">
        <div class="font-medium text-gray-900">{{ row.name }}</div>
      </template>

      <template #cell-sku="{ row }">
        <span class="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md font-mono" v-if="row.sku">
          {{ row.sku }}
        </span>
        <span class="text-gray-400 italic text-sm" v-else>-</span>
      </template>

      <template #cell-category="{ row }">
        <div class="text-gray-600 flex items-center gap-2">
          <svg v-if="row.category" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-blue-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
          </svg>
          {{ row.category?.name || '-' }}
        </div>
      </template>

      <template #cell-price="{ row }">
        <div class="font-semibold text-emerald-600">{{ formatCurrency(row.price) }}</div>
      </template>
      
      <template #cell-stock="{ row }">
        <div class="flex items-center gap-2">
          <span :class="[
            'w-2 h-2 rounded-full',
            row.stock > 10 ? 'bg-green-500' : row.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
          ]"></span>
          <span class="font-medium text-gray-700">{{ row.stock }}</span>
        </div>
      </template>

      <template #cell-actions="{ row }">
        <TableActions 
          :show-edit="hasPermission('edit.product')"
          :show-delete="hasPermission('delete.product')"
          @edit="openEditModal(row)"
          @delete="deleteProduct(row.id)"
        />
      </template>
    </DataTable>

    <!-- Modal Form -->
    <BaseModal 
      v-model="isModalOpen" 
      :title="isEditMode ? 'Edit Produk' : 'Tambah Produk'"
    >
      <div class="space-y-4">
        <!-- Name -->
        <Input 
          label="Nama Produk" 
          v-model="form.name" 
          placeholder="Masukkan nama produk..."
          :error="formErrors.name"
          required
        />
        
        <!-- Grid for SKU & Category -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- SKU -->
          <Input 
            label="SKU (Opsional)" 
            v-model="form.sku" 
            placeholder="Contoh: PRD-001"
            :error="formErrors.sku"
          />
          
          <!-- Category Async Select -->
          <AsyncSelect
            v-model="form.category_id"
            label="Kategori"
            placeholder="Cari kategori..."
            :fetchOptions="searchCategories"
            displayKey="name"
            valueKey="id"
            :error="formErrors.category_id"
          />
        </div>
        
        <!-- Grid for Price & Stock -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Price -->
          <Input 
            label="Harga (Rp)" 
            type="number"
            v-model="form.price" 
            placeholder="0"
            :error="formErrors.price"
            required
            min="0"
          />
          
          <!-- Stock -->
          <Input 
            label="Stok Awal" 
            type="number"
            v-model="form.stock" 
            placeholder="0"
            :error="formErrors.stock"
            required
            min="0"
          />
        </div>

        <!-- Description with TextEditor -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-gray-700">Deskripsi Produk (Opsional)</label>
          <TextEditor 
            v-model="form.description" 
            placeholder="Tuliskan deskripsi lengkap mengenai produk ini..."
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3 w-full">
          <Button color="gray" variant="outline" @click="closeModal">Batal</Button>
          <Button color="blue" @click="saveProduct" :loading="isSaving">
            {{ isSaving ? 'Menyimpan...' : 'Simpan Produk' }}
          </Button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useProducts } from '~/composables/useProducts'
import { categoryService } from '~/utils/category.service'
import { useDebounceFn } from '@vueuse/core'

const { hasPermission } = useUser()

const {
  products,
  isLoading,
  isSaving,
  searchQuery,
  currentPage,
  totalPages,
  totalItems,
  limit,
  isModalOpen,
  isEditMode,
  form,
  formErrors,
  fetchProducts,
  openAddModal,
  openEditModal,
  closeModal,
  saveProduct,
  deleteProduct,
  formatCurrency
} = useProducts()

// Define table columns
const columns = [
  { key: 'no', label: 'No' },
  { key: 'name', label: 'Nama Produk' },
  { key: 'sku', label: 'SKU' },
  { key: 'category', label: 'Kategori' },
  { key: 'price', label: 'Harga' },
  { key: 'stock', label: 'Stok' },
  { key: 'actions', label: 'Aksi' }
]

// Function to fetch categories for AsyncSelect
const searchCategories = async (query: string) => {
  try {
    const response = await categoryService.getCategories(1, 15, query)
    return response.data?.data || []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

// Search with debounce (if @vueuse/core is not installed, it might break, but we used it previously? Wait, I will write a simple manual debounce just in case)
let searchTimeout: any = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchProducts(1)
  }, 500)
})

onMounted(() => {
  fetchProducts()
})

useHead({
  title: 'Manajemen Produk'
})
</script>
