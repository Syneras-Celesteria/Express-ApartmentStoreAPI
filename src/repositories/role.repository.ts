import { injectable } from "inversify";
import { GenericRepository } from "./generic.repository";
import { Role } from "../entities/role.entity";
import { IRoleRepository } from "./interfaces/irole.repository";
import { Client } from "../utils/prismaTypes";

@injectable()
export class RoleRepository extends GenericRepository<Role, 'role'> implements IRoleRepository {
    constructor() {
        super('role')
    }

    public async findByName(name: string, client: Client): Promise<Role | null> {
        return client.role.findFirst({
            where: { name }
        });
    }
}