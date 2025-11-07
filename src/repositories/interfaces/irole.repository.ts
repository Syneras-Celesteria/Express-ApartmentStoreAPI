import { Role } from "../../entities/role.entity";
import { Client } from "../../utils/prismaTypes";
import { IGenericRepository } from "./igeneric.repository";

export interface IRoleRepository extends IGenericRepository<Role> {
    findByName(name: string, client: Client): Promise<Role | null>
}