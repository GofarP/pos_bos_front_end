import { ref } from 'vue'
import { transactionService } from '~/utils/transaction.service'
import type { Transaction } from '~/types/transaction.type'

export function useTransactions() {
  const swal = useSweetAlert()

  const transactions = ref<Transaction[]>([])
  const isLoading = ref(false)
  const isDetailLoading = ref(false)
  const isCancelling = ref(false)
  const isDetailModalOpen = ref(false)
  const selectedTransaction = ref<Transaction | null>(null)

  const startDate = ref('')
  const endDate = ref('')
  const searchQuery = ref('')

  const meta = ref({
    page: 1,
    limit: 10,
    total_records: 0,
    total_pages: 1
  })

  const fetchTransactions = async (page = 1) => {
    isLoading.value = true
    try {
      const params: Record<string, any> = {
        page,
        limit: meta.value.limit
      }
      if (startDate.value) params.start_date = startDate.value
      if (endDate.value) params.end_date = endDate.value

      const response = await transactionService.getAllTransactions(params)
      const data = response.data

      transactions.value = data.data || []
      if (data.meta) {
        meta.value = {
          page: data.meta.page || 1,
          limit: data.meta.limit || 10,
          total_records: data.meta.total_records || 0,
          total_pages: data.meta.total_pages || 1
        }
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      swal.showError('Gagal memuat daftar transaksi.')
    } finally {
      isLoading.value = false
    }
  }

  const changePage = (page: number) => {
    fetchTransactions(page)
  }

  const openDetailModal = async (id: number) => {
    isDetailLoading.value = true
    isDetailModalOpen.value = true
    try {
      const response = await transactionService.getTransactionById(id)
      selectedTransaction.value = response.data?.data || response.data || null
    } catch (error) {
      console.error('Failed to fetch transaction detail:', error)
      swal.showError('Gagal memuat detail transaksi.')
      isDetailModalOpen.value = false
    } finally {
      isDetailLoading.value = false
    }
  }

  const closeDetailModal = () => {
    isDetailModalOpen.value = false
    selectedTransaction.value = null
  }

  const handleCancelTransaction = async (id: number) => {
    const confirmed = await swal.showConfirm(
      'Batalkan Transaksi?',
      'Stok produk akan dikembalikan dan status transaksi menjadi DIBATALKAN.'
    )
    if (!confirmed) return

    isCancelling.value = true
    try {
      await transactionService.cancelTransaction(id)
      swal.showSuccess('Transaksi berhasil dibatalkan.')
      if (selectedTransaction.value && selectedTransaction.value.id === id) {
        selectedTransaction.value.status = 'CANCELLED'
      }
      fetchTransactions(meta.value.page)
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Gagal membatalkan transaksi.'
      swal.showError(msg)
    } finally {
      isCancelling.value = false
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return {
    transactions,
    isLoading,
    isDetailLoading,
    isCancelling,
    isDetailModalOpen,
    selectedTransaction,
    startDate,
    endDate,
    searchQuery,
    meta,
    fetchTransactions,
    changePage,
    openDetailModal,
    closeDetailModal,
    handleCancelTransaction,
    formatCurrency,
    formatDate
  }
}
