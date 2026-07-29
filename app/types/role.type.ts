import type { Permission } from './permission.type'

export interface Role {
    id: number
    name: string
    description?: string
    permissions?: Permission[]
}

export interface RoleForm {
    name: string
    description?: string
    permission_ids?: number[] // Array of permission IDs
}
