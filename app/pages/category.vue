<template>
  <div class="p-4 lg:p-8 max-w-7xl mx-auto min-h-screen">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Kategori</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola data kategori produk Anda di sini.</p>
      </div>
    </div>

    <!-- Toolbar: Search & Add Button -->
    <div class="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 gap-4">
      <div class="relative w-full sm:w-96 group">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari kategori..." 
          class="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white outline-none transition-all"
        />
      </div>

      <!-- Add Button -->
      <button 
        @click="openAddModal"
        class="fixed bottom-6 right-6 z-30 sm:static sm:z-auto sm:w-auto w-14 h-14 sm:h-auto bg-emerald-600 hover:bg-emerald-700 text-white sm:px-5 sm:py-2.5 rounded-full sm:rounded-xl text-sm font-medium transition-all shadow-lg sm:shadow-none shadow-emerald-600/30 active:scale-95 flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 sm:w-5 sm:h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span class="hidden sm:inline">Tambah Kategori</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
      <p class="text-sm text-gray-500 font-medium animate-pulse">Memuat data kategori...</p>
    </div>

    <!-- Data Table Component -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
      <p class="text-sm text-gray-500 font-medium animate-pulse">Memuat data kategori...</p>
    </div>

    <DataTable 
      v-else
      :data="categories" 
      :columns="columns"
      :pagination="{
        currentPage: meta.page,
        totalPages: meta.total_pages,
        totalItems: meta.total_records,
        itemsPerPage: meta.limit
      }"
      @page-change="changePage"
    >
      <template #cell-name="{ value }">
        <div class="font-medium text-gray-900">{{ value }}</div>
      </template>

      <template #cell-description="{ value }">
        <div class="text-gray-500 truncate max-w-xs">{{ value || '-' }}</div>
      </template>

      <template #cell-actions="{ row }">
        <TableActions 
          @edit="openEditModal(row)"
          @delete="handleDelete(row.id)"
        />
      </template>
    </DataTable>

    <!-- Modal Form -->
    <BaseModal 
      v-model="isModalOpen" 
      :title="isEdit ? 'Edit Kategori' : 'Tambah Kategori'"
    >
      <form @submit.prevent="saveCategory" novalidate class="space-y-5">
        <Input 
          id="name" 
          label="Nama Kategori" 
          v-model="form.name" 
          :error="formErrors.name" 
          placeholder="Contoh: Elektronik"
        />
        
        <Input 
          id="description" 
          label="Deskripsi Kategori" 
          v-model="form.description" 
          :error="formErrors.description" 
          placeholder="Tuliskan detail kategori"
        />

        <div class="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button 
            type="button" 
            @click="closeModal"
            class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            :disabled="isSaving"
            class="flex justify-center items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-70"
          >
            <div v-if="isSaving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Simpan
          </button>
        </div>
      </form>
    </BaseModal>

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const {
  categories, meta, searchQuery, isLoading, isModalOpen, isEdit,
  isSaving, form, formErrors, fetchCategories, changePage,
  openAddModal, openEditModal, closeModal, saveCategory, handleDelete
} = useCategories()

const columns = [
  { key: 'no', label: 'No' },
  { key: 'name', label: 'Nama Kategori' },
  { key: 'description', label: 'Deskripsi' },
  { key: 'actions', label: 'Aksi' }
]

onMounted(() => {
  fetchCategories()
})
</script>
