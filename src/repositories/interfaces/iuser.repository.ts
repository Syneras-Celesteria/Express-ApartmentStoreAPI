import { User } from "../../entities/user.entity";
import { IGenericRepository } from "./igeneric.repository";
import { Client } from "../../utils/prismaTypes";

export interface IUserRepository extends IGenericRepository<User> {
    getByEmail(email: string, client: Client): Promise<User | null>;
    findByIdentifier(identifier: string, client: Client): Promise<User | null>;
}