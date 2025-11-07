import { inject } from "inversify";
import { IRoleService } from "./interfaces/irole.service";
import { IRoleRepository } from "../repositories/interfaces/irole.repository";
import { Role, BaseRole, CreateRoleDTO } from "../entities/role.entity";
import { prismaManager } from "../utils/prisma";
import { ErrorResponseV2 } from "../business_objects/error.response";
import { ErrorCode } from "../utils/enums/enums";
import { plainToClass } from "class-transformer";
import { IUserRoleRepository } from "../repositories/interfaces/iuserRole.repository";

export class RoleService implements IRoleService {
    constructor(
        @inject("IRoleRepository") private roleRepository: IRoleRepository,
        @inject("IUserRoleRepository") private userRoleRepository: IUserRoleRepository
    ) {

    }

    public async createRole(dto: CreateRoleDTO, adminUser: string): Promise<BaseRole> {
        return prismaManager.withTransaction(async (client) => {
            const role = await this.roleRepository.findByName(dto.name, client);
            if (role) {
                throw new ErrorResponseV2(ErrorCode.DUPLICATE_ROLE)
            }

            const newRole = await this.roleRepository.create(dto as Role, adminUser, client)

            return plainToClass(BaseRole, newRole, { excludeExtraneousValues: true })
        })
    }

    public async getRoleByName(roleName: string): Promise<BaseRole> {
        return prismaManager.withConnection(async (client) => {
            const role = await this.roleRepository.findByName(roleName, client)

            if (!role || !role.id) {
                throw new ErrorResponseV2(ErrorCode.ROLE_NOT_FOUND)
            }

            return plainToClass(BaseRole, role, { excludeExtraneousValues: true })
        })
    }

    public async deleteRole(roleName: string, adminUser: string): Promise<BaseRole> {
        return prismaManager.withTransaction(async (client) => {
            const role = await this.roleRepository.findByName(roleName, client)

            if (!role || !role.id) {
                throw new ErrorResponseV2(ErrorCode.ROLE_NOT_FOUND)
            }

            if (role.toDate) {
                throw new ErrorResponseV2(ErrorCode.ROLE_DELETED)
            }

            const activeAssignments = await this.userRoleRepository.getAllByRole([roleName], client)
            if (activeAssignments.length > 0) {
                throw new ErrorResponseV2(ErrorCode.ROLE_IS_IN_USE)
            }

            const deleteRole = await this.roleRepository.delete(role.id, adminUser, client)
            return plainToClass(BaseRole, deleteRole, { excludeExtraneousValues: true })
        })
    }
}