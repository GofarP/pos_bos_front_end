import { api } from './api'
import type { User, PaginationResponse } from '~/types/user.type'

export const userService = {
  /**
   * Mengambil daftar pengguna dengan paginasi dan pencarian
   */
  async getUsers(page: number = 1, limit: number = 10, search: string = '') {
    return await api.get<PaginationResponse<User>>('/users', {
      params: { page, limit, search }
    })
  },

  /**
   * Mengambil satu pengguna berdasarkan ID
   */
  async getUserById(id: number) {
    return await api.get<{ data: User }>(`/users/${id}`)
  },

  /**
   * Menambahkan pengguna baru menggunakan FormData (karena ada upload foto)
   */
  async createUser(formData: FormData) {
    return await api.post<{ message: string; data: User }>('/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * Memperbarui data pengguna menggunakan FormData
   */
  async updateUser(id: number, formData: FormData) {
    return await api.put<{ message: string; data: User }>(`/users/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * Menghapus pengguna
   */
  async deleteUser(id: number) {
    return await api.delete<{ message: string }>(`/users/${id}`)
  }
}
