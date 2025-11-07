import { injectable } from "inversify";
import { User } from "../entities/user.entity";
import { GenericRepository } from "./generic.repository";
import { IUserRepository } from "./interfaces/iuser.repository";
import { Client } from "../utils/prismaTypes";

@injectable()
export class UserRepository extends GenericRepository<User, "user"> implements IUserRepository {
    constructor() {
        super("user");
    }

    public async getByEmail(email: string, client: Client): Promise<User | null> {
        return client.user.findFirst({
            where: {
                email,
                toDate: null,
                fromDate: {
                    lte: new Date()
                }
            },
        });
    }

    public async findByIdentifier(identifier: string, client: Client): Promise<User | null> {
        return client.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier },
                    { phone: identifier }
                ],
                toDate: null,
                fromDate: {
                    lte: new Date()
                },
            },
            include: {
                userRoles: {
                    include: {
                        role: {
                            select: { name: true },
                        }
                    }
                }
            }
        });
    }


}