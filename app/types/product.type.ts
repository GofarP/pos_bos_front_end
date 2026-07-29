import type { Category } from './category.type'

export interface Product {
    id: number
    category_id: number | null
    category?: Category
    sku: string | null
    name: string
    description: string | null
    price: number
    stock: number
    created_at?: string
    updated_at?: string
}

export interface ProductForm {
    category_id: number | null
    sku: string | null
    name: string
    description: string | null
    price: number
    stock: number
}
