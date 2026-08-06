import { defineNuxtRouteMiddleware, navigateTo, useCookie, showError, createError } from '#imports'
import { useAuthUser } from '~/composables/useAuthUser'

const routePermissions: Record<string, string | string[]> = {
  '/category': 'view.category',
  '/products': ['view.product', 'create.product'],
  '/pos': 'create.transaction',
  '/transactions': 'view.transaction',
  '/users': 'view.user',
  '/roles': 'view.role',
  '/permissions': 'view.permission'
}

export default defineNuxtRouteMiddleware(async (to, from) => {
  const isLoggedIn = useCookie('is_logged_in')
  const publicPages = ['/login', '/register']
  const isPublicPage = publicPages.includes(to.path)

  if (!isLoggedIn.value && !isPublicPage) {
    return navigateTo('/login')
  }

  if (isLoggedIn.value && isPublicPage) {
    return navigateTo('/')
  }

  if (isLoggedIn.value && process.client) {
    const { user, fetchCurrentUser, hasPermission } = useAuthUser()
    
    if (!user.value) {
      await fetchCurrentUser()
    }

    // Hapus trailing slash di production (contoh: /users/ menjadi /users)
    const normalizedPath = (to.path.endsWith('/') && to.path !== '/') ? to.path.slice(0, -1) : to.path
    const requiredPermission = routePermissions[normalizedPath]
    if (requiredPermission && !hasPermission(requiredPermission)) {
      return abortNavigation(createError({
        statusCode: 403,
        statusMessage: 'Akses Ditolak: Anda tidak memiliki izin untuk mengakses halaman ini.'
      }))
    }
  }
})
