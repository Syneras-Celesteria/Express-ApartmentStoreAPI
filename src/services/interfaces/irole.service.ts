import { BaseRole, CreateRoleDTO } from "../../entities/role.entity";

export interface IRoleService {
    createRole(roleName: CreateRoleDTO, adminUser: string): Promise<BaseRole>
    getRoleByName(roleName: string): Promise<BaseRole>
    deleteRole(roleName: string, adminUser: string): Promise<BaseRole>
}