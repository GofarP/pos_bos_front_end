<template>
  <div class="space-y-6">
    <!-- Header & Action -->
    <div class="flex justify-between items-center gap-4">
      <h1 class="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
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
          placeholder="Cari nama atau email..."
          class="!pl-10"
        />
      </div>
    </div>

    <!-- Action Button -->
    <div class="flex justify-end">
      <Button color="green" @click="openAddModal" class="gap-2 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Tambah Pengguna
      </Button>
    </div>

    <!-- Data Table Component -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
      <p class="text-sm text-gray-500 font-medium animate-pulse">Memuat data pengguna...</p>
    </div>

    <DataTable 
      v-else
      :data="users" 
      :columns="columns"
      :pagination="{
        currentPage: meta.page,
        totalPages: meta.total_pages,
        totalItems: meta.total_records,
        itemsPerPage: meta.limit
      }"
      @page-change="changePage"
    >

      <template #cell-photo="{ row }">
        <img 
          v-if="row.photo" 
          :src="getPhotoUrl(row.photo)" 
          alt="Avatar" 
          class="h-9 w-9 rounded-full object-cover border border-gray-200 shadow-sm"
        />
        <div v-else class="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200 shadow-sm">
          {{ row.name ? row.name.charAt(0).toUpperCase() : 'U' }}
        </div>
      </template>

      <template #cell-roles="{ value }">
        <div class="flex flex-wrap gap-1 max-w-[200px]">
          <span 
            v-for="role in (value || []).slice(0, 2)" 
            :key="role.id"
            class="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 capitalize whitespace-nowrap"
          >
            {{ role.name }}
          </span>
          <span 
            v-if="(value || []).length > 2" 
            class="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200 whitespace-nowrap"
          >
            +{{ value.length - 2 }} lainnya
          </span>
          <span v-if="!value || value.length === 0" class="text-xs text-gray-400 italic">Belum ada role</span>
        </div>
      </template>

      <template #cell-created_at="{ value }">
        <div class="text-sm text-gray-500">
          {{ new Date(value).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) }}
        </div>
      </template>

      <template #cell-actions="{ row }">
        <TableActions 
          @edit="openEditModal(row)"
          @delete="handleDelete(row.id)"
        />
      </template>
    </DataTable>

    <!-- Modal Form -->
    <BaseModal v-model="isModalOpen" :title="isEdit ? 'Edit Pengguna' : 'Tambah Pengguna Baru'">
      <form id="userForm" @submit.prevent="saveUser" novalidate>
        <div class="space-y-4">
          <Input 
            label="Nama Lengkap" 
            v-model="form.name" 
            :error="formErrors.name"
          />
          
          <Input 
            label="Email" 
            type="email"
            v-model="form.email" 
            :error="formErrors.email"
          />

          <div>
            <AsyncMultiSelect
              label="Role"
              v-model="form.roles"
              :fetch-options="fetchRoles"
              display-key="name"
              value-key="id"
              placeholder="Cari dan pilih role..."
              :error="formErrors.roles"
            />
          </div>

          <div>
            <div class="flex justify-between items-center mb-1.5">
              <label class="text-sm font-medium text-gray-700">Password</label>
              <span v-if="isEdit" class="text-xs text-gray-400 font-normal">(Kosongkan jika tidak ingin diubah)</span>
            </div>
            <Input 
              type="password" 
              v-model="form.password" 
              :error="formErrors.password"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Foto Profil (Opsional)</label>
            <input type="file" accept="image/*" @change="handleFileUpload" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100">
            <p v-if="formErrors.photo" class="text-sm text-red-500 font-medium mt-1.5">{{ formErrors.photo }}</p>
          </div>
        </div>
      </form>
      
      <template #footer>
        <Button form="userForm" type="submit" color="green" :disabled="isSaving" class="w-full sm:w-auto">
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

const {
  users, meta, searchQuery, isLoading, isModalOpen, isEdit,
  isSaving, form, formErrors, fetchUsers, changePage, getPhotoUrl,
  openAddModal, openEditModal, closeModal, saveUser, handleDelete,
  handleFileUpload
} = useUsers()

const fetchRoles = async (query: string) => {
  try {
    const response = await api.get(`/roles`, { params: { page: 1, limit: 20, search: query } })
    return response.data?.data || []
  } catch (error) {
    console.error('Failed to fetch roles:', error)
    return []
  }
}

const columns = [
  { key: 'no', label: 'No' },
  { key: 'name', label: 'Nama' },
  { key: 'email', label: 'Email' },
  { key: 'roles', label: 'Role' },
  { key: 'photo', label: 'Profil' },
  { key: 'created_at', label: 'Dibuat Pada' },
  { key: 'actions', label: 'Aksi' }
]

onMounted(() => {
  fetchUsers()
})

useHead({
  title: 'Manajemen Pengguna'
})
</script>
