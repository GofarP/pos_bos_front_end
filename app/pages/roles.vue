<template>
  <div class="space-y-6">
    <!-- Header & Action -->
    <div class="flex justify-between items-center gap-4">
      <h1 class="text-2xl font-bold text-gray-900">Manajemen Role</h1>
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
          placeholder="Cari nama role..."
          class="!pl-10"
        />
      </div>
    </div>

    <!-- Action Button -->
    <div class="flex justify-end" v-if="hasPermission('create.role')">
      <Button color="green" @click="openAddModal" class="gap-2 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Tambah Role
      </Button>
    </div>

    <!-- Data Table Component -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
      <p class="text-sm text-gray-500 font-medium animate-pulse">Memuat data role...</p>
    </div>

    <DataTable 
      v-else
      :data="roles" 
      :columns="columns"
      :pagination="{
        currentPage: meta.page,
        totalPages: meta.total_pages,
        totalItems: meta.total_records,
        itemsPerPage: meta.limit
      }"
      @page-change="changePage"
    >
      <template #cell-permissions="{ value }">
        <div class="flex flex-wrap gap-1 max-w-[250px]">
          <span 
            v-for="permission in (value || []).slice(0, 3)" 
            :key="permission.id"
            class="px-2 py-0.5 text-xs font-medium rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap"
          >
            {{ permission.name }}
          </span>
          <span 
            v-if="(value || []).length > 3" 
            class="px-2 py-0.5 text-xs font-medium rounded-md bg-gray-100 text-gray-600 border border-gray-200 whitespace-nowrap"
          >
            +{{ value.length - 3 }} lainnya
          </span>
          <span v-if="!value || value.length === 0" class="text-xs text-gray-400 italic">Tidak ada permission</span>
        </div>
      </template>
      
      <!-- Remove HTML tags for simple table display -->
      <template #cell-description="{ value }">
         <div class="truncate max-w-[200px]" v-html="value"></div>
      </template>

      <template #cell-actions="{ row }">
        <TableActions 
          :show-edit="hasPermission('edit.role')"
          :show-delete="hasPermission('delete.role')"
          @edit="openEditModal(row)"
          @delete="handleDelete(row.id)"
        />
      </template>
    </DataTable>

    <!-- Modal Form -->
    <BaseModal v-model="isModalOpen" :title="isEdit ? 'Edit Role' : 'Tambah Role Baru'">
      <form id="roleForm" @submit.prevent="saveRole" novalidate>
        <div class="space-y-4">
          <Input 
            label="Nama Role" 
            v-model="form.name" 
            :error="formErrors.name"
            placeholder="Contoh: Admin"
          />
          
          <div>
            <AsyncMultiSelect
              label="Permissions"
              v-model="form.permissions"
              :fetch-options="fetchPermissions"
              display-key="name"
              value-key="id"
              placeholder="Cari dan pilih permissions..."
              :error="formErrors.permissions"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Role</label>
            <TextEditor
              v-model="form.description"
              placeholder="Jelaskan kegunaan role ini..."
              :class="{ 'ring-1 ring-red-500 border-red-500': formErrors.description }"
            />
            <p v-if="formErrors.description" class="mt-1.5 text-sm text-red-500 font-medium">
              {{ formErrors.description }}
            </p>
          </div>
        </div>
      </form>
      
      <template #footer>
        <Button form="roleForm" type="submit" color="green" :disabled="isSaving" class="w-full sm:w-auto">
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
import { onMounted } from 'vue'
import { api } from '~/utils/api'
import { useRoles } from '~/composables/useRoles'

const { hasPermission } = useAuthUser()

const {
  roles, meta, searchQuery, isLoading, isModalOpen, isEdit,
  isSaving, form, formErrors, fetchRoles, changePage,
  openAddModal, openEditModal, closeModal, saveRole, handleDelete
} = useRoles()

const fetchPermissions = async (query: string) => {
  try {
    const response = await api.get(`/permissions`, { params: { page: 1, limit: 30, search: query } })
    return response.data?.data || []
  } catch (error) {
    console.error('Failed to fetch permissions:', error)
    return []
  }
}

const columns = [
  { key: 'no', label: 'No' },
  { key: 'name', label: 'Nama Role' },
  { key: 'permissions', label: 'Permissions' },
  { key: 'description', label: 'Deskripsi' },
  { key: 'actions', label: 'Aksi' }
]

onMounted(() => {
  fetchRoles()
})

useHead({
  title: 'Manajemen Role'
})
</script>
