import { inject, injectable } from "inversify";
import { IUserService } from "./interfaces/iuser.service";
import { IUserRepository } from "../repositories/interfaces/iuser.repository";
import { CreateUserDTO, BaseUser, User, UpdateUserDTO } from "../entities/user.entity";
import { PasswordUtil } from "../utils/password/password.util";
import { plainToClass, plainToInstance } from "class-transformer";
import { ErrorResponseV2 } from "../business_objects/error.response"
import { Pagination, PaginationParameter } from "../business_objects/pagination";
import { ErrorCode } from "../utils/enums/enums";
import { prismaManager } from "../utils/prisma";
import { IRoleRepository } from "../repositories/interfaces/irole.repository";
import { IUserRoleRepository } from "../repositories/interfaces/iuserRole.repository";

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject("IUserRepository") private userRepository: IUserRepository,
        @inject("IRoleRepository") private roleRepository: IRoleRepository,
        @inject("IUserRoleRepository") private userRoleRepository: IUserRoleRepository,
    ) { }

    public async createUser(userData: CreateUserDTO): Promise<BaseUser> {
        return prismaManager.withTransaction(async (tx) => {

            const identifier = userData.email || userData.username || userData.phone

            if (!identifier) {
                throw new ErrorResponseV2(ErrorCode.VALIDATION_FAILED)

            }

            const existedUser = await this.userRepository.findByIdentifier(identifier, tx)
            if (existedUser) {
                throw new ErrorResponseV2(ErrorCode.DUPLICATE_USER);
            }

            delete userData.confirmPassword;
            const user = plainToClass(User, userData, { excludeExtraneousValues: true });
            user.emailVerified = false;
            user.password = await PasswordUtil.hashPassword(user.password);

            const createdUser = await this.userRepository.create(user, user.username, tx)
            if (!createdUser || !createdUser.id) {
                throw new ErrorResponseV2(ErrorCode.NOT_FOUND_USER)
            }

            const defaultRole = await this.roleRepository.findByName("USER", tx)
            if (!defaultRole) {
                throw new ErrorResponseV2(ErrorCode.ROLE_NOT_FOUND)
            }

            await this.userRoleRepository.createUserRole(createdUser.id, 'USER', tx)

            return plainToClass(BaseUser, createdUser, { excludeExtraneousValues: true })
        })

    }

    public async getUser(id: string): Promise<BaseUser | null> {
        return prismaManager.withConnection(async (client) => {
            const user = await this.userRepository.getById(id, client);
            return plainToClass(BaseUser, user, { excludeExtraneousValues: true });
        })

    }

    public async getUserByEmail(email: string): Promise<BaseUser | null> {
        return prismaManager.withConnection(async (client) => {
            return plainToClass(BaseUser, await this.userRepository.getByEmail(email, client), { excludeExtraneousValues: true });
        })
    }
    public async getAllUser(para: PaginationParameter): Promise<Pagination<BaseUser>> {
        return prismaManager.withConnection(async (client) => {
            const source = await this.userRepository.getAll(para, client);
            const items = plainToInstance(BaseUser, source.items, { excludeExtraneousValues: true });
            return new Pagination<BaseUser>(items, source.totalCount, source.currentPage, source.pageSize);
        })
    }


    public async updateUsers(id: string, adminUser: string, newData: UpdateUserDTO): Promise<BaseUser> {
        return prismaManager.withTransaction(async (tx) => {
            const user = await this.userRepository.getById(id, tx);
            if (!user) {
                throw new ErrorResponseV2(ErrorCode.NOT_FOUND_USER);
            }
            return plainToClass(BaseUser, await this.userRepository.update(id, adminUser, newData, tx), { excludeExtraneousValues: true });
        })

    }

    public async updateCurrentUsers(id: string, selfUser: string, newData: UpdateUserDTO): Promise<BaseUser> {
        return prismaManager.withTransaction(async (tx) => {
            const user = await this.userRepository.getById(id, tx);
            if (!user || !user.id) {
                throw new ErrorResponseV2(ErrorCode.NOT_FOUND_USER);
            }
            return plainToClass(BaseUser, await this.userRepository.update(user.id, selfUser, newData, tx), { excludeExtraneousValues: true });
        })

    }

    public async deleteUsers(id: string, adminUser: string): Promise<BaseUser> {
        return prismaManager.withTransaction(async (tx) => {
            const user = await this.userRepository.getById(id, tx);
            if (!user) {
                throw new ErrorResponseV2(ErrorCode.NOT_FOUND_USER)
            }

            if (user.toDate) {
                throw new ErrorResponseV2(ErrorCode.DELETED_USER)
            }

            if (user.userRoles?.some(ur => ur.role?.name === 'ADMIN')) {
                throw new ErrorResponseV2(ErrorCode.CANNOT_DELETE_ADMIN)
            }

            return plainToClass(BaseUser, await this.userRepository.delete(id, adminUser, tx), { excludeExtraneousValues: true })
        })

    }
}