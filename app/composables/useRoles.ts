import { ref, watch } from 'vue'
import { roleService } from '~/utils/role.service'
import type { Role } from '~/types/role.type'
import type { Permission } from '~/types/permission.type'
import { useSweetAlert } from '~/composables/useSweetAlert'
import { AxiosError } from 'axios'

export function useRoles() {
    const swal = useSweetAlert()

    // State
    const roles = ref<Role[]>([])
    const meta = ref({ page: 1, total_pages: 1, total_records: 0, limit: 10 })
    const searchQuery = ref('')
    const isLoading = ref(false)
    const isSaving = ref(false)

    // Modal State
    const isModalOpen = ref(false)
    const isEdit = ref(false)
    const form = ref<{ id: number | null, name: string, description: string, permissions: Permission[] }>({ 
        id: null, 
        name: '', 
        description: '', 
        permissions: [] 
    })
    const formErrors = ref({ name: '', description: '', permissions: '' })

    // Fetch Data
    const fetchRoles = async (page = 1) => {
        isLoading.value = true
        try {
            const response = await roleService.getRoles(page, meta.value.limit, searchQuery.value)
            roles.value = response.data.data
            meta.value = response.data.meta
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>
            const errorMessage = error.response?.data?.message || error.message
            swal.showError(`Gagal mengambil data role: ${errorMessage}`)
        } finally {
            isLoading.value = false
        }
    }

    // Debounced Search
    let searchTimeout: ReturnType<typeof setTimeout> | null = null
    watch(searchQuery, () => {
        if (searchTimeout) clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {
            fetchRoles(1)
        }, 500)
    })

    // Pagination
    const changePage = (newPage: number) => {
        if (newPage > 0 && newPage <= meta.value.total_pages) {
            fetchRoles(newPage)
        }
    }

    // Modal Operations
    const openAddModal = () => {
        isEdit.value = false
        form.value = { id: null, name: '', description: '', permissions: [] }
        formErrors.value = { name: '', description: '', permissions: '' }
        isModalOpen.value = true
    }

    const openEditModal = (role: Role) => {
        isEdit.value = true
        form.value = { 
            id: role.id, 
            name: role.name, 
            description: role.description || '',
            permissions: role.permissions || []
        }
        formErrors.value = { name: '', description: '', permissions: '' }
        isModalOpen.value = true
    }

    const closeModal = () => {
        isModalOpen.value = false
    }

    const saveRole = async () => {
        formErrors.value = { name: '', description: '', permissions: '' }

        isSaving.value = true

        try {
            // Convert permissions objects to an array of their IDs
            const permissionIds = form.value.permissions.map(p => p.id)

            const payload = {
                name: form.value.name,
                description: form.value.description,
                permission_ids: permissionIds
            }

            if (isEdit.value && form.value.id) {
                await roleService.updateRole(form.value.id, payload)
                swal.showSuccess('Role berhasil diperbarui!')
            } else {
                await roleService.createRole(payload)
                swal.showSuccess('Role berhasil ditambahkan!')
            }
            closeModal()
            fetchRoles(1)
        } catch (err: unknown) {
            const error = err as AxiosError<{ error?: string, errors?: Record<string, string> }>
            const data = error.response?.data
            if (data?.errors) {
                formErrors.value.name = data.errors.name || ''
                formErrors.value.description = data.errors.description || ''
                formErrors.value.permissions = data.errors.permissionids || data.errors.permission_ids || ''
            } else {
                swal.showError(data?.error || 'Terjadi kesalahan saat menyimpan role')
            }
        } finally {
            isSaving.value = false
        }
    }

    // Delete Data
    const handleDelete = async (id: number) => {
        const isConfirmed = await swal.showConfirm(
            'Hapus Role?',
            'Yakin ingin menghapus role ini? Data pengguna yang memiliki role ini mungkin terpengaruh.',
            'Ya, Hapus!'
        )
        if (isConfirmed) {
            try {
                await roleService.deleteRole(id)
                swal.showSuccess('Role berhasil dihapus!')
                fetchRoles(1)
            } catch (err: unknown) {
                const error = err as AxiosError<{ message?: string }>
                const errorMessage = error.response?.data?.message || error.message
                swal.showError(`Gagal menghapus role: ${errorMessage}`)
            }
        }
    }

    return {
        roles, meta, searchQuery, isLoading, isModalOpen, isEdit,
        isSaving, form, formErrors, fetchRoles, changePage,
        openAddModal, openEditModal, closeModal, saveRole, handleDelete
    }
}
