import { api } from './api'

export const authService = {
  /**
   * Mengirim kredensial login ke server backend
   */
  async login(credentials: Record<string, string>) {
    return await api.post<{ message: string, data: any }>('/login', credentials)
  },

  /**
   * Melakukan proses logout ke server
   */
  async logout() {
    return await api.post('/logout')
  },

  /**
   * Cek apakah user sedang login berdasarkan flag is_logged_in
   */
  isLoggedIn() {
    const loggedInCookie = useCookie('is_logged_in')
    return !!loggedInCookie.value
  },

  /**
   * Menghapus indikator login dari sisi client
   */
  removeToken() {
    const loggedInCookie = useCookie('is_logged_in')
    loggedInCookie.value = null
  }
}
