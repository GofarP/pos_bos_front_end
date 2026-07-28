import { api } from './api'

import type { CategoryForm } from '~/types/category.type'


export const categoryService = {
    getCategories(page = 1, limit = 10, search = "") {
        return api.get(`/categories`, {
            params: { page, limit, search }
        })
    },

    createCategory(data: CategoryForm) {
        return api.post(`/categories`, data)
    },

    updateCategory(id: number, data: CategoryForm) {
        return api.put(`/categories/${id}`, data)
    },

    deleteCategory(id: number) {
        return api.delete(`/categories/${id}`)
    }

}