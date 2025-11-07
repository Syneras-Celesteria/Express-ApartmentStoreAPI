import { Pagination, PaginationParameter } from "../../business_objects/pagination";
import { UserRole } from "../../entities/userRole.entity";
import { Client } from "../../utils/prismaTypes";
import { IGenericRepository } from "./igeneric.repository";

export interface IUserRoleRepository extends IGenericRepository<UserRole> {
    createUserRole(userId: string, roleName: string, client: Client): Promise<UserRole>
    updateUserRole(userId: string, roleNames: string[], client: Client): Promise<UserRole[]>
    getAllByUser(userId: string, client: Client): Promise<UserRole[]> 
    getAllByRole(roleName: string[], client: Client): Promise<UserRole[]>
    getByRole(roleNames: string[], para: PaginationParameter, client: Client): Promise<Pagination<UserRole>>
    getByUser(userId: string, para: PaginationParameter, client: Client): Promise<Pagination<UserRole>>
    deleteUserRole(userId: string, roleName: string, client: Client): Promise<UserRole>
}