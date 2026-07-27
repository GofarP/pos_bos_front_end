import { api } from './api'

export interface Category {
    id: number
    name: string
    description: string
    created_at?: string
    updated_at?: string
}

export interface CategoryForm {
    name: string
    description: string
}


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