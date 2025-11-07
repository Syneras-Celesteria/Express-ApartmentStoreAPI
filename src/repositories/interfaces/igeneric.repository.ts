import { Pagination, PaginationParameter } from "../../business_objects/pagination";
import { BaseEntity } from "../../entities/base/base.entity";
import { Client } from "../../utils/prismaTypes";


export interface IGenericRepository<T extends BaseEntity> {
    getAll(para: PaginationParameter, client: Client, filter?: object, options?: any): Promise<Pagination<any>>;
    getById(id: string, client: Client, options?: any): Promise<T | null>;
    create(data: T, currentUser: string, client: Client): Promise<T>;
    update(id: string, currentUser: string, data: Partial<T>, client: Client): Promise<T>;
    delete(id: string, currentUser: string, client: Client): Promise<T>;
    restore(id: string, currentUser: string, client: Client): Promise<T>;
}
