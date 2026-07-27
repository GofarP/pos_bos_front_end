import axios from 'axios'
import { useRuntimeConfig, useCookie } from '#imports'

/**
 * Membuat instance custom dari Axios untuk digunakan di seluruh aplikasi.
 * Ini otomatis akan menggunakan baseURL yang didefinisikan di nuxt.config.ts.
 */
export const api = axios.create({
  withCredentials: true
})

// Menambahkan interceptor request
api.interceptors.request.use((config) => {
  // Mengambil config runtime untuk baseURL
  const runtimeConfig = useRuntimeConfig()
  config.baseURL = runtimeConfig.public.apiBase as string

  // Otomatis menyisipkan Token via Cookie HttpOnly, sehingga tidak perlu set Header Authorization manual


  return config
})

// Menambahkan interceptor response
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Jika error adalah 401 Unauthorized dan request belum pernah di-retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // Tandai agar tidak infinite loop

      try {
        // Panggil endpoint refresh (dengan kredensial agar cookie refresh_token terkirim)
        const runtimeConfig = useRuntimeConfig()
        await axios.post(
          `${runtimeConfig.public.apiBase}/refresh`,
          {},
          { withCredentials: true }
        )

        // Browser akan otomatis menyimpan cookie HttpOnly baru (access_token & refresh_token)
        // Ulangi request yang tadinya gagal
        return api(originalRequest)
      } catch (refreshError) {
        // Jika gagal refresh, hapus indikator login dan alihkan ke halaman login
        useCookie('is_logged_in').value = null
        
        // redirect jika kita berada di environment browser
        if (process.client) {
          window.location.href = '/login'
        }
        
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
