import { api } from './api'
import type { PermissionForm } from '~/types/permission.type'

export const permissionService = {
    getPermissions(page = 1, limit = 10, search = "") {
        return api.get(`/permissions`, {
            params: { page, limit, search }
        })
    },
    createPermission(data: PermissionForm) {
        return api.post(`/permissions`, data)
    },

    updatePermission(id: number, data: PermissionForm) {
        return api.put(`/permissions/${id}`, data)
    },

    deletePermission(id: number) {
        return api.delete(`/permissions/${id}`)
    }
}

