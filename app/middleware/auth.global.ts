import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  // Ambil status login dari cookie (is_logged_in)
  const isLoggedIn = useCookie('is_logged_in')

  // Daftar halaman yang tidak butuh autentikasi
  const publicPages = ['/login', '/register']
  
  const isPublicPage = publicPages.includes(to.path)

  // Skenario 1: Belum login tapi mencoba mengakses halaman yang diproteksi (seperti /users)
  if (!isLoggedIn.value && !isPublicPage) {
    // Hentikan proses render halaman dan langsung alihkan ke /login
    return navigateTo('/login')
  }

  // Skenario 2: Sudah login tapi mencoba masuk ke halaman login
  if (isLoggedIn.value && isPublicPage) {
    // Alihkan kembali ke beranda (dashboard)
    return navigateTo('/')
  }
})
