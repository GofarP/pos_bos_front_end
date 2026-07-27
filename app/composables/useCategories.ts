import { ref, watch } from 'vue'
import { categoryService, type Category } from '~/utils/category.service'
import { useSweetAlert } from '~/composables/useSweetAlert'
import { AxiosError } from 'axios'

export function useCategories() {
    const swal = useSweetAlert()

    // State
    const categories = ref<Category[]>([])
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
    const fetchCategories = async (page = 1) => {
        isLoading.value = true
        try {
            const response = await categoryService.getCategories(page, meta.value.limit, searchQuery.value)
            categories.value = response.data.data
            meta.value = response.data.meta
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>
            const errorMessage = error.response?.data?.message || error.message
            swal.showError(`Gagal mengambil data kategori: ${errorMessage}`)
        } finally {
            isLoading.value = false
        }
    }

    // Debounced Search
    let searchTimeout: ReturnType<typeof setTimeout> | null = null
    watch(searchQuery, () => {
        if (searchTimeout) clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {
            fetchCategories(1)
        }, 500)
    })

    // Pagination
    const changePage = (newPage: number) => {
        if (newPage > 0 && newPage <= meta.value.total_pages) {
            fetchCategories(newPage)
        }
    }

    // Buka Modal Tambah
    const openAddModal = () => {
        isEdit.value = false
        form.value = { id: null, name: '', description: '' }
        formErrors.value = { name: '', description: '' }
        isModalOpen.value = true
    }

    // Buka Modal Edit
    const openEditModal = (category: Category) => {
        isEdit.value = true
        form.value = { id: category.id, name: category.name, description: category.description }
        formErrors.value = { name: '', description: '' }
        isModalOpen.value = true
    }

    const closeModal = () => {
        isModalOpen.value = false
    }

    // Simpan Kategori (Tambah / Edit)
    const saveCategory = async () => {
        formErrors.value = { name: '', description: '' }
        isSaving.value = true

        try {
            const payload = {
                name: form.value.name,
                description: form.value.description
            }

            if (isEdit.value && form.value.id) {
                await categoryService.updateCategory(form.value.id, payload)
                swal.showSuccess('Kategori berhasil diperbarui!')
            } else {
                await categoryService.createCategory(payload)
                swal.showSuccess('Kategori berhasil ditambahkan!')
            }
            closeModal()
            fetchCategories(1)
        } catch (err: unknown) {
            const error = err as AxiosError<{ error?: string, errors?: Record<string, string> }>
            const data = error.response?.data
            if (data?.errors) {
                Object.assign(formErrors.value, data.errors)
            } else {
                swal.showError(data?.error || 'Terjadi kesalahan saat menyimpan kategori')
            }
        } finally {
            isSaving.value = false
        }
    }

    // Hapus Kategori
    const handleDelete = async (id: number) => {
        const isConfirmed = await swal.showConfirm(
            'Hapus Kategori?',
            'Apakah Anda yakin ingin menghapus kategori ini? Data yang terhubung mungkin akan ikut terhapus.',
            'Ya, Hapus!'
        )
        if (isConfirmed) {
            try {
                await categoryService.deleteCategory(id)
                swal.showSuccess('Kategori berhasil dihapus!')
                fetchCategories(1)
            } catch (err: unknown) {
                const error = err as AxiosError<{ message?: string }>
                const errorMessage = error.response?.data?.message || error.message
                swal.showError(`Gagal menghapus kategori: ${errorMessage}`)
            }
        }
    }

    return {
        categories, meta, searchQuery, isLoading, isModalOpen, isEdit,
        isSaving, form, formErrors, fetchCategories, changePage,
        openAddModal, openEditModal, closeModal, saveCategory, handleDelete
    }
}
