import { injectable } from "inversify";
import { GenericRepository } from "./generic.repository";
import { IUserRoleRepository } from "./interfaces/iuserRole.repository";
import { UserRole } from "../entities/userRole.entity";
import { Client } from "../utils/prismaTypes";
import { PaginationParameter, Pagination } from "../business_objects/pagination";

@injectable()
export class UserRoleRepository extends GenericRepository<UserRole, 'userRole'> implements IUserRoleRepository {
    constructor() {
        super('userRole')
    }

    public async getAllByUser(userId: string, client: Client): Promise<UserRole[]> {
        const userRoles = await client.userRole.findMany({
            where: {
                userId: userId, toDate: null
            },
            include: {
                user: true,
                role: true,
            }
        })
        return userRoles as UserRole[]
    }

    public async getAllByRole(roleName: string[], client: Client): Promise<UserRole[]> {
        const userRoles = await client.userRole.findMany({
            where: {
                role: {
                    name: {
                        in: roleName.map(role => role)
                    }
                },
                toDate: null
            }
        })
        return userRoles as UserRole[]
    }

    public async createUserRole(userId: string, roleName: string, client: Client): Promise<UserRole> {
        const userRole = await client.userRole.create({
            data: {
                user: { connect: { id: userId } },
                role: { connect: { name: roleName } }
            },
            include: {
                user: true,
                role: true,
            }
        })
        return userRole as UserRole
    }

    public async updateUserRole(userId: string, roleNames: string[], client: Client): Promise<UserRole[]> {
        await client.userRole.updateMany({
            where: { userId: userId, toDate: null },
            data: { toDate: new Date() }
        })

        const createdRoles = await Promise.all(
            roleNames.map(async (roleName) => {
                const role = await client.role.findUnique({
                    where: { name: roleName },
                    select: { id: true }
                });
                if (!role) {
                    throw new Error(`Role with name ${roleName} not found`)

                }
                return client.userRole.upsert({
                    where: { userId_roleId: { userId: userId, roleId: role.id } },
                    update: { toDate: null, fromDate: new Date() },
                    create: {
                        userId: userId,
                        roleId: role.id
                    },
                    include: {
                        user: true,
                        role: true
                    }
                })
            })
        )
        return createdRoles as UserRole[]
    }

    public async getByRole(roleNames: string[], para: PaginationParameter, client: Client): Promise<Pagination<UserRole>> {
        const totalCount = await client.userRole.count({
            where: {
                role: {
                    name: {
                        in: roleNames.map(role => role)
                    }
                },
                toDate: null
            },
        })
        const items = await client.userRole.findMany({
            skip: (para.pageIndex - 1) * para.pageSize,
            take: para.pageSize,
            where: {
                role: {
                    name: {
                        in: roleNames.map(role => role)
                    }
                },
                toDate: null
            },
            include: {
                user: true,
                role: true
            }
        })
        return new Pagination(items, totalCount, para.pageIndex, para.pageSize) as Pagination<UserRole>
    }

    public async getByUser(userId: string, para: PaginationParameter, client: Client): Promise<Pagination<UserRole>> {
        const totalCount = await client.userRole.count({
            where: { userId: userId, toDate: null }
        })
        const items = await client.userRole.findMany({
            skip: (para.pageIndex - 1) * para.pageSize,
            take: para.pageSize,
            where: { userId: userId, toDate: null },
            include: {
                user: true,
                role: true
            }
        })
        return new Pagination(items, totalCount, para.pageIndex, para.pageSize) as Pagination<UserRole>;
    }

    public async deleteUserRole(userId: string, roleName: string, client: Client): Promise<UserRole> {
        const model = this.getModel(client);
        const role = await client.role.findFirst({
            where: { name: roleName },
            select: { id: true }
        });
        if (!role) {
            throw new Error(`Role with name ${roleName} not found`)
        }
        return await (model as any).update({
            where: { userId_roleId: { userId: userId, roleId: role.id } },
            data: { toDate: new Date() }
        })
    }
}