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

export function useUser() {
  const user = useState<UserProfile | null>('user_profile', () => null)
  const permissions = useState<string[]>('user_permissions', () => [])
  const isLoading = useState<boolean>('user_loading', () => false)

  const fetchCurrentUser = async () => {
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
    } finally {
      isLoading.value = false
    }
  }

  const hasPermission = (perm: string): boolean => {
    if (!user.value && permissions.value.length === 0) return false
    if (user.value?.roles?.some(r => r.name === 'Superadmin')) {
      return true
    }
    return permissions.value.includes(perm)
  }

  const hasAnyPermission = (perms: string[]): boolean => {
    if (!user.value && permissions.value.length === 0) return false
    if (user.value?.roles?.some(r => r.name === 'Superadmin')) {
      return true
    }
    return perms.some(p => permissions.value.includes(p))
  }

  return {
    user,
    permissions,
    isLoading,
    fetchCurrentUser,
    hasPermission,
    hasAnyPermission
  }
}
