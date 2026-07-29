import { api } from './api'
import type { TransactionRequest } from '~/types/transaction.type'

export const transactionService = {
    async createTransaction(payload: TransactionRequest) {
        return await api.post('/transactions', payload)
    },

    async getAllTransactions(params?: Record<string, any>) {
        return await api.get('/transactions', { params })
    },

    async getTransactionById(id: number) {
        return await api.get(`/transactions/${id}`)
    },

    async cancelTransaction(id: number) {
        return await api.put(`/transactions/${id}/cancel`)
    }
}
