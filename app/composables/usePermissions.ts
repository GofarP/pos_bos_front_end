import { ref, watch } from 'vue'
import { permissionService } from '~/utils/permission.service'
import type { Permission } from '~/types/permission.type'
import { useSweetAlert } from '~/composables/useSweetAlert'
import { AxiosError } from 'axios'

export function usePermissions() {
    const swal = useSweetAlert()

    // State
    const permissions = ref<Permission[]>([])
    const meta = ref({ page: 1, total_pages: 1, total_records: 0, limit: 10 })
    const searchQuery = ref('')
    const isLoading = ref(false)
    const isSaving = ref(false)

    // Modal State
    const isModalOpen = ref(false)
    const isEdit = ref(false)
    const form = ref<{ id: number | null, name: string, description: string }>({ id: null, name: '', description: '' })
    const formErrors = ref({ name: '', description: '' })

    // Fetch Data
    const fetchPermissions = async (page = 1) => {
        isLoading.value = true
        try {
            const response = await permissionService.getPermissions(page, meta.value.limit, searchQuery.value)
            permissions.value = response.data.data
            meta.value = response.data.meta
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>
            const errorMessage = error.response?.data?.message || error.message
            swal.showError(`Gagal mengambil data permission: ${errorMessage}`)
        } finally {
            isLoading.value = false
        }
    }

    // Debounced Search
    let searchTimeout: ReturnType<typeof setTimeout> | null = null
    watch(searchQuery, () => {
        if (searchTimeout) clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {
            fetchPermissions(1)
        }, 500)
    })

    // Pagination
    const changePage = (newPage: number) => {
        if (newPage > 0 && newPage <= meta.value.total_pages) {
            fetchPermissions(newPage)
        }
    }

    // Fungsi Buka Tutup Modal
    const openAddModal = () => {
        isEdit.value = false
        form.value = { id: null, name: '', description: '' }
        formErrors.value = { name: '', description: '' }
        isModalOpen.value = true
    }

    const openEditModal = (permission: Permission) => {
        isEdit.value = true
        form.value = { id: permission.id, name: permission.name, description: permission.description || '' }
        formErrors.value = { name: '', description: '' }
        isModalOpen.value = true
    }

    const closeModal = () => {
        isModalOpen.value = false
    }

    const savePermission = async () => {
        formErrors.value = { name: '', description: '' }

        isSaving.value = true

        try {
            const payload = {
                name: form.value.name,
                description: form.value.description
            }

            if (isEdit.value && form.value.id) {
                await permissionService.updatePermission(form.value.id, payload)
                swal.showSuccess('Permission berhasil diperbarui!')
            } else {
                await permissionService.createPermission(payload)
                swal.showSuccess('Permission berhasil ditambahkan!')
            }
            closeModal()
            fetchPermissions(1)
        } catch (err: unknown) {
            const error = err as AxiosError<{ error?: string, errors?: Record<string, string> }>
            const data = error.response?.data
            if (data?.errors) {
                Object.assign(formErrors.value, data.errors)
            } else {
                swal.showError(data?.error || 'Terjadi kesalahan saat menyimpan permission')
            }
        } finally {
            isSaving.value = false
        }
    }

    // Fungsi Hapus Data
    const handleDelete = async (id: number) => {
        const isConfirmed = await swal.showConfirm(
            'Hapus Permission?',
            'Yakin ingin menghapus permission ini? Data mungkin terhapus secara permanen.',
            'Ya, Hapus!'
        )
        if (isConfirmed) {
            try {
                await permissionService.deletePermission(id)
                swal.showSuccess('Permission berhasil dihapus!')
                fetchPermissions(1)
            } catch (err: unknown) {
                const error = err as AxiosError<{ message?: string }>
                const errorMessage = error.response?.data?.message || error.message
                swal.showError(`Gagal menghapus permission: ${errorMessage}`)
            }
        }
    }

    return {
        permissions, meta, searchQuery, isLoading, isModalOpen, isEdit,
        isSaving, form, formErrors, fetchPermissions, changePage,
        openAddModal, openEditModal, closeModal, savePermission, handleDelete
    }
}
