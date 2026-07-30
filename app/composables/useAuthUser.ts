import { useState } from '#imports'
import { api } from '~/utils/api'

export interface UserProfile {
  id: number
  name: string
  email: string
  photo?: string
  roles?: Array<{ id: number; name: string }>
  permissions?: string[]
}

export function useAuthUser() {
  const user = useState<UserProfile | null>('user_profile', () => null)
  const permissions = useState<string[]>('user_permissions', () => [])
  const isLoading = useState<boolean>('user_loading', () => false)

  const clearUser = () => {
    user.value = null
    permissions.value = []
  }

  const fetchCurrentUser = async (force = false) => {
    if (user.value && !force) return

    isLoading.value = true
    try {
      const response = await api.get('/me')
      const userData = response.data?.data
      if (userData) {
        user.value = userData
        permissions.value = userData.permissions || []
      }
    } catch (err) {
      console.error('Failed to fetch current user:', err)
      clearUser()
    } finally {
      isLoading.value = false
    }
  }

  const hasPermission = (perm: string | string[]): boolean => {
    if (!user.value && permissions.value.length === 0) return false
    if (user.value?.roles?.some(r => r.name === 'Superadmin')) {
      return true
    }
    if (Array.isArray(perm)) {
      return perm.some(p => permissions.value.includes(p))
    }
    return permissions.value.includes(perm)
  }

  const hasAnyPermission = (perms: string[]): boolean => {
    return hasPermission(perms)
  }

  const hasAllPermissions = (perms: string[]): boolean => {
    if (!user.value && permissions.value.length === 0) return false
    if (user.value?.roles?.some(r => r.name === 'Superadmin')) {
      return true
    }
    return perms.every(p => permissions.value.includes(p))
  }

  return {
    user,
    permissions,
    isLoading,
    clearUser,
    fetchCurrentUser,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  }
}
