import { Pagination, PaginationParameter } from "../../business_objects/pagination";
import { BaseUser, CreateUserDTO, UpdateUserDTO } from "../../entities/user.entity";

export interface IUserService {
    createUser(user: CreateUserDTO): Promise<BaseUser>;
    getUser(id: string): Promise<BaseUser | null>;
    getAllUser(para: PaginationParameter): Promise<Pagination<BaseUser>>;
    getUserByEmail(email: string): Promise<BaseUser | null>;
    updateUsers(id: string, adminUser: string, newData: UpdateUserDTO): Promise<BaseUser>;
    updateCurrentUsers(email: string, selfUser: string, newData: UpdateUserDTO): Promise<BaseUser>;
    deleteUsers(id: string, adminUser: string): Promise<BaseUser>;
}