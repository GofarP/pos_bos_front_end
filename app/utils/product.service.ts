import { api } from './api'
import type { Product, ProductForm } from '~/types/product.type'

export const productService = {
    async getProducts(params?: Record<string, any>) {
        return await api.get('/products', { params })
    },

    async getProductById(id: number) {
        return await api.get(`/products/${id}`)
    },

    async createProduct(payload: ProductForm) {
        // We clean up empty strings for nullable fields before sending
        const cleanPayload = { ...payload }
        if (cleanPayload.sku === '') cleanPayload.sku = null
        if (cleanPayload.description === '') cleanPayload.description = null

        return await api.post('/products', cleanPayload)
    },

    async updateProduct(id: number, payload: ProductForm) {
        const cleanPayload = { ...payload }
        if (cleanPayload.sku === '') cleanPayload.sku = null
        if (cleanPayload.description === '') cleanPayload.description = null

        return await api.put(`/products/${id}`, cleanPayload)
    },

    async deleteProduct(id: number) {
        return await api.delete(`/products/${id}`)
    }
}
