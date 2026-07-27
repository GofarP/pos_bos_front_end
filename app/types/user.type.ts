export interface User {
  id: number
  name: string
  email: string
  photo?: string
  created_at: string
  updated_at: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total_records: number
  total_pages: number
}

export interface PaginationResponse<T> {
  data: T[]
  meta: PaginationMeta
}
