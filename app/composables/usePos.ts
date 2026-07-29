import { ref, computed, watch } from 'vue'
import { productService } from '~/utils/product.service'
import { transactionService } from '~/utils/transaction.service'
import type { Product } from '~/types/product.type'
import type { CartItem } from '~/types/transaction.type'

const LIMIT = 20

export const usePos = () => {
    const swal = useSweetAlert()

    const products = ref<Product[]>([])
    const cart = ref<CartItem[]>([])
    const searchQuery = ref('')
    const isLoadingProducts = ref(false)
    const isLoadingMore = ref(false)
    const isProcessing = ref(false)
    const showReceipt = ref(false)
    const lastTransaction = ref<any>(null)
    const currentPage = ref(1)
    const hasMore = ref(true)

    let searchTimer: ReturnType<typeof setTimeout> | null = null

    const cartTotal = computed(() =>
        cart.value.reduce((sum, item) => sum + item.subtotal, 0)
    )

    const cartCount = computed(() =>
        cart.value.reduce((sum, item) => sum + item.quantity, 0)
    )

    watch(searchQuery, () => {
        if (searchTimer) clearTimeout(searchTimer)
        searchTimer = setTimeout(() => {
            currentPage.value = 1
            products.value = []
            hasMore.value = true
            fetchProducts(1, true)
        }, 400)
    })

    const fetchProducts = async (page = 1, isSearch = false) => {
        if (page === 1) {
            isLoadingProducts.value = true
        } else {
            isLoadingMore.value = true
        }

        try {
            const params: Record<string, any> = { page, limit: LIMIT }
            if (searchQuery.value.trim()) {
                params.search = searchQuery.value.trim()
            }

            const response = await productService.getProducts(params)
            const newProducts: Product[] = response.data?.data || []
            const meta = response.data?.meta

            if (page === 1 || isSearch) {
                products.value = newProducts
            } else {
                products.value = [...products.value, ...newProducts]
            }

            if (meta) {
                hasMore.value = page < (meta.total_pages || 1)
            } else {
                hasMore.value = newProducts.length === LIMIT
            }

            currentPage.value = page
        } catch (error) {
            console.error('Failed to fetch products:', error)
            swal.showError('Gagal memuat daftar produk.')
        } finally {
            isLoadingProducts.value = false
            isLoadingMore.value = false
        }
    }

    const loadMore = () => {
        if (!isLoadingMore.value && hasMore.value) {
            fetchProducts(currentPage.value + 1)
        }
    }

    const addToCart = (product: Product) => {
        if (product.stock <= 0) {
            swal.showError(`Stok produk "${product.name}" habis!`)
            return
        }

        const existing = cart.value.find(c => c.product_id === product.id)
        if (existing) {
            if (existing.quantity >= product.stock) {
                swal.showError(`Stok "${product.name}" tidak cukup (maks: ${product.stock})`)
                return
            }
            existing.quantity++
            existing.subtotal = existing.price * existing.quantity
        } else {
            cart.value.push({
                product_id: product.id,
                name: product.name,
                sku: product.sku,
                price: product.price,
                stock: product.stock,
                quantity: 1,
                subtotal: product.price
            })
        }
    }

    const updateQuantity = (productId: number, quantity: number) => {
        const item = cart.value.find(c => c.product_id === productId)
        if (!item) return
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }
        if (quantity > item.stock) {
            swal.showError(`Stok "${item.name}" tidak cukup (maks: ${item.stock})`)
            return
        }
        item.quantity = quantity
        item.subtotal = item.price * quantity
    }

    const removeFromCart = (productId: number) => {
        cart.value = cart.value.filter(c => c.product_id !== productId)
    }

    const clearCart = async () => {
        if (cart.value.length === 0) return
        const confirmed = await swal.showConfirm(
            'Kosongkan Keranjang?',
            'Semua item di keranjang akan dihapus.'
        )
        if (confirmed) cart.value = []
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const processTransaction = async () => {
        if (cart.value.length === 0) {
            swal.showError('Keranjang masih kosong!')
            return
        }

        isProcessing.value = true
        try {
            const idempotencyKey = `pos-${Date.now()}-${Math.random().toString(36).slice(2)}`
            const payload = {
                idempotency_key: idempotencyKey,
                items: cart.value.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity
                }))
            }

            const response = await transactionService.createTransaction(payload)
            lastTransaction.value = response.data?.data || response.data
            showReceipt.value = true
            cart.value = []
            await fetchProducts(1, true)
        } catch (error: any) {
            console.error('Transaction failed:', error)
            const msg = error.response?.data?.message || error.data?.message || 'Gagal memproses transaksi.'
            swal.showError(msg)
        } finally {
            isProcessing.value = false
        }
    }

    const closeReceipt = () => {
        showReceipt.value = false
        lastTransaction.value = null
    }

    return {
        products,
        cart,
        searchQuery,
        isLoadingProducts,
        isLoadingMore,
        isProcessing,
        hasMore,
        showReceipt,
        lastTransaction,
        cartTotal,
        cartCount,
        fetchProducts,
        loadMore,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        formatCurrency,
        processTransaction,
        closeReceipt
    }
}
