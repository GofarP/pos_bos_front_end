import { ref } from 'vue'
import { productService } from '~/utils/product.service'
import type { Product, ProductForm } from '~/types/product.type'

export const useProducts = () => {
    const swal = useSweetAlert()

    // State
    const products = ref<Product[]>([])
    const isLoading = ref(false)
    const isSaving = ref(false)
    const searchQuery = ref('')
    
    // Pagination State
    const currentPage = ref(1)
    const totalItems = ref(0)
    const totalPages = ref(0)
    const limit = ref(10)

    // Form State
    const isModalOpen = ref(false)
    const isEditMode = ref(false)
    const editId = ref<number | null>(null)
    
    const form = ref<ProductForm>({
        category_id: null,
        sku: '',
        name: '',
        description: '',
        price: 0,
        stock: 0
    })

    const formErrors = ref({
        name: '',
        sku: '',
        category_id: '',
        price: '',
        stock: ''
    })

    // Fungsi Ambil Data
    const fetchProducts = async (page = 1) => {
        isLoading.value = true
        try {
            const params: Record<string, any> = {
                page,
                limit: limit.value
            }

            if (searchQuery.value) {
                params.search = searchQuery.value
            }

            const response = await productService.getProducts(params)
            
            if (response.data && response.data.data) {
                products.value = response.data.data
                currentPage.value = response.data.meta?.page || 1
                totalItems.value = response.data.meta?.total_records || 0
                totalPages.value = response.data.meta?.total_pages || 0
            } else if (response.data) {
                // Fallback for non-paginated arrays or other formats
                products.value = Array.isArray(response.data) ? response.data : []
            }
        } catch (error) {
            console.error('Failed to fetch products:', error)
            swal.showError('Gagal mengambil daftar produk.')
        } finally {
            isLoading.value = false
        }
    }

    // Modal Handlers
    const openAddModal = () => {
        isEditMode.value = false
        editId.value = null
        form.value = { 
            category_id: null, 
            sku: '', 
            name: '', 
            description: '', 
            price: 0, 
            stock: 0 
        }
        formErrors.value = { name: '', sku: '', category_id: '', price: '', stock: '' }
        isModalOpen.value = true
    }

    const openEditModal = (product: Product) => {
        isEditMode.value = true
        editId.value = product.id
        form.value = {
            category_id: product.category_id,
            sku: product.sku || '',
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock
        }
        formErrors.value = { name: '', sku: '', category_id: '', price: '', stock: '' }
        isModalOpen.value = true
    }

    const closeModal = () => {
        isModalOpen.value = false
    }

    // Fungsi Simpan (Create / Update)
    const saveProduct = async () => {
        formErrors.value = { name: '', sku: '', category_id: '', price: '', stock: '' }
        isSaving.value = true

        try {
            // Ensure numbers
            const payload = {
                ...form.value,
                price: Number(form.value.price) || 0,
                stock: Number(form.value.stock) || 0
            }

            if (isEditMode.value && editId.value) {
                await productService.updateProduct(editId.value, payload)
                swal.showSuccess('Produk berhasil diperbarui!')
            } else {
                await productService.createProduct(payload)
                swal.showSuccess('Produk berhasil ditambahkan!')
            }
            
            closeModal()
            await fetchProducts(currentPage.value)
        } catch (err: any) {
            console.error('Failed to save product:', err)
            
            const errorData = err.response?.data || err.data
            
            // Handle validation errors from backend
            if (errorData?.errors) {
                const apiErrors = errorData.errors
                if (apiErrors.name) formErrors.value.name = apiErrors.name
                if (apiErrors.sku) formErrors.value.sku = apiErrors.sku
                if (apiErrors.categoryid || apiErrors.category_id) formErrors.value.category_id = apiErrors.categoryid || apiErrors.category_id
                if (apiErrors.price) formErrors.value.price = apiErrors.price
                if (apiErrors.stock) formErrors.value.stock = apiErrors.stock
            } else {
                swal.showError(errorData?.message || 'Gagal menyimpan data produk')
            }
        } finally {
            isSaving.value = false
        }
    }

    // Fungsi Hapus
    const deleteProduct = async (id: number) => {
        const isConfirmed = await swal.showConfirm(
            'Hapus Produk?',
            'Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.'
        )
        if (!isConfirmed) return

        try {
            await productService.deleteProduct(id)
            swal.showSuccess('Produk berhasil dihapus!')
            await fetchProducts(currentPage.value)
        } catch (error: any) {
            console.error('Failed to delete product:', error)
            swal.showError(error.data?.message || 'Gagal menghapus produk')
        }
    }

    // Format Rupiah
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

    return {
        products,
        isLoading,
        isSaving,
        searchQuery,
        currentPage,
        totalItems,
        totalPages,
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
    }
}
