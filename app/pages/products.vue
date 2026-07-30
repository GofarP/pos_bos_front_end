<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center gap-4">
      <h1 class="text-2xl font-bold text-gray-900">Manajemen Produk</h1>
    </div>

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

    <div class="flex justify-end" v-if="hasPermission('create.product')">
      <Button color="green" @click="openAddModal" class="gap-2 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Tambah Produk
      </Button>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
      <p class="text-sm text-gray-500 font-medium animate-pulse">Memuat data produk...</p>
    </div>

    <DataTable
      v-else
      :columns="columns"
      :data="products"
      :pagination="{
        currentPage: currentPage,
        totalPages: totalPages,
        totalItems: totalItems,
        itemsPerPage: limit
      }"
      @page-change="changePage"
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

    <BaseModal 
      v-model="isModalOpen" 
      :title="isEditMode ? 'Edit Produk' : 'Tambah Produk'"
    >
      <form id="productForm" @submit.prevent="saveProduct" novalidate>
        <div class="space-y-4">
          <Input
            label="Nama Produk"
            v-model="form.name"
            :error="formErrors.name"
            placeholder="Masukkan nama produk..."
          />

          <Input
            label="SKU (Stock Keeping Unit)"
            v-model="form.sku"
            :error="formErrors.sku"
            placeholder="Contoh: EL-001"
          />

          <AsyncSelect
            label="Kategori"
            v-model="form.category_id"
            :fetch-options="searchCategories"
            display-key="name"
            value-key="id"
            placeholder="Cari dan pilih kategori..."
            :error="formErrors.category_id"
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Harga (Rp)"
              type="number"
              v-model="form.price"
              :error="formErrors.price"
              placeholder="0"
            />

            <Input
              label="Stok"
              type="number"
              v-model="form.stock"
              :error="formErrors.stock"
              placeholder="0"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Produk</label>
            <TextEditor
              v-model="form.description"
              placeholder="Jelaskan spesifikasi atau deskripsi produk..."
            />
          </div>
        </div>
      </form>

      <template #footer>
        <Button form="productForm" type="submit" color="green" :disabled="isSaving" class="w-full sm:w-auto">
          {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
        </Button>

        <Button type="button" color="gray" @click="closeModal" class="mt-3 sm:mt-0 w-full sm:w-auto">
          Batal
        </Button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useAuthUser } from '~/composables/useAuthUser'
import { useProducts } from '~/composables/useProducts'
import { categoryService } from '~/utils/category.service'

const { hasPermission } = useAuthUser()

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

const columns = [
  { key: 'no', label: 'No' },
  { key: 'name', label: 'Nama Produk' },
  { key: 'sku', label: 'SKU' },
  { key: 'category', label: 'Kategori' },
  { key: 'price', label: 'Harga' },
  { key: 'stock', label: 'Stok' },
  { key: 'actions', label: 'Aksi' }
]

const searchCategories = async (query: string) => {
  try {
    const response = await categoryService.getCategories(1, 15, query)
    return response.data?.data || []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

const changePage = (page: number) => {
  fetchProducts(page)
}

let searchTimeout: any = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchProducts(1)
  }, 400)
})

onMounted(() => {
  fetchProducts()
})

useHead({
  title: 'Manajemen Produk — POS BOS'
})
</script>
