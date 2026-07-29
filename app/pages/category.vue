<template>
  <div class="space-y-6">
    <!-- Header & Action -->
    <div class="flex justify-between items-center gap-4">
      <h1 class="text-2xl font-bold text-gray-900">Manajemen Kategori</h1>
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
          placeholder="Cari kategori..."
          class="!pl-10"
        />
      </div>
    </div>

    <!-- Action Button -->
    <div class="flex justify-end" v-if="hasPermission('create.category')">
      <Button color="green" @click="openAddModal" class="gap-2 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Tambah Kategori
      </Button>
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
          :show-edit="hasPermission('edit.category')"
          :show-delete="hasPermission('delete.category')"
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
      <form id="categoryForm" @submit.prevent="saveCategory" novalidate>
        <div class="space-y-4">
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
        </div>
      </form>
      
      <template #footer>
        <Button form="categoryForm" type="submit" color="green" :disabled="isSaving" class="w-full sm:w-auto">
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
const { hasPermission } = useUser()

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

useHead({
  title: 'Manajemen Kategori'
})
</script>
