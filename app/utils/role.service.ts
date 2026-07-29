import { api } from './api'
import type { RoleForm } from '~/types/role.type'

export const roleService = {
    getRoles(page = 1, limit = 10, search = "") {
        return api.get(`/roles`, {
            params: { page, limit, search }
        })
    },
    createRole(data: RoleForm) {
        return api.post(`/roles`, data)
    },
    updateRole(id: number, data: RoleForm) {
        return api.put(`/roles/${id}`, data)
    },
    deleteRole(id: number) {
        return api.delete(`/roles/${id}`)
    }
}
