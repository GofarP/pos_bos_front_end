export interface TransactionItem {
    id: number
    transaction_id: number
    product_id: number
    quantity: number
    price: number
    subtotal: number
}

export interface Transaction {
    id: number
    user_id: number
    invoice_number: string
    total_amount: number
    idempotency_key: string
    status: string
    items: TransactionItem[]
    created_at: string
    updated_at: string
}

export interface TransactionItemRequest {
    product_id: number
    quantity: number
}

export interface TransactionRequest {
    idempotency_key: string
    items: TransactionItemRequest[]
}

// Cart item (product + quantity for the UI)
export interface CartItem {
    product_id: number
    name: string
    sku: string | null
    price: number
    stock: number
    quantity: number
    subtotal: number
}
