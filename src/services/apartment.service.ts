import { inject, injectable } from "inversify";
import { IApartmentService } from "./interfaces/iapartment.service";
import { IApartmentRepository } from "../repositories/interfaces/iapartment.repository";
import { IBuildingRepository } from "../repositories/interfaces/ibuilding.repository";
import { IUserRepository } from "../repositories/interfaces/iuser.repository";
import { CreateApartmentDTO, BaseApartment, UpdateApartmentDTO, Apartment } from "../entities/apartment.entity";
import { prismaManager } from "../utils/prisma";
import { ErrorResponseV2 } from "../business_objects/error.response";
import { ErrorCode } from "../utils/enums/enums";
import { plainToClass, plainToInstance } from "class-transformer";
import { PaginationParameter, Pagination } from "../business_objects/pagination";

@injectable()
export class ApartmentService implements IApartmentService {
    constructor(
        @inject("IApartmentRepository") private apartmentRepository: IApartmentRepository,
        @inject("IBuildingRepository") private buildingRepository: IBuildingRepository,
        @inject("IUserRepository") private userRepository: IUserRepository,
    ) {

    }

    public async createApartment(dto: CreateApartmentDTO, currentUser: string): Promise<BaseApartment> {
        return prismaManager.withTransaction(async (tx) => {
            const parentBuilding = await this.buildingRepository.getById(dto.buildingId, tx)
            if (!parentBuilding) {
                throw new ErrorResponseV2(ErrorCode.BUILDING_NOT_FOUND)
            }

            const contactUser = await this.userRepository.getById(dto.contactUserId, tx)
            if (!contactUser) {
                throw new ErrorResponseV2(ErrorCode.NOT_FOUND_USER)
            }

            const newApartment = await this.apartmentRepository.createApartment(dto, currentUser, tx)
            return plainToClass(BaseApartment, newApartment, { excludeExtraneousValues: true })
        })
    }

    public async updateApartment(apartmentId: string, dto: UpdateApartmentDTO, currentUser: string): Promise<BaseApartment> {
        return prismaManager.withTransaction(async (tx) => {
            const apartment = await this.apartmentRepository.getById(apartmentId, tx)
            if (!apartment) {
                throw new ErrorResponseV2(ErrorCode.APARTMENT_NOT_FOUND)
            }

            if (dto.buildingId && dto.buildingId !== apartment.buildingId) {
                const parentBuilding = await this.buildingRepository.getById(dto.buildingId, tx)
                if (!parentBuilding) {
                    throw new ErrorResponseV2(ErrorCode.BUILDING_NOT_FOUND)
                }

                if (dto.contactUserId && dto.contactUserId !== apartment.contactUserId) {
                    const contactUser = await this.userRepository.getById(dto.contactUserId, tx)
                }
            }

            const updatedApartment = await this.apartmentRepository.update(apartmentId, currentUser, dto as Apartment, tx)
            const result = await this.apartmentRepository.getApartmentById(updatedApartment.id!, tx)
            return plainToClass(BaseApartment, result, { excludeExtraneousValues: true })
        })
    }

    public async deleteApartment(apartmentId: string, currentUser: string): Promise<BaseApartment> {
        return prismaManager.withTransaction(async (tx) => {
            const apartment = await this.apartmentRepository.getById(apartmentId, tx)
            if (!apartment) {
                throw new ErrorResponseV2(ErrorCode.APARTMENT_NOT_FOUND)
            }

            if (apartment.status === "RENTED") {
                throw new ErrorResponseV2(ErrorCode.APARTMENT_IS_RENTED)
            }

            const deletedApartment = await this.apartmentRepository.delete(apartmentId, currentUser, tx)
            return plainToClass(BaseApartment, deletedApartment, { excludeExtraneousValues: true })
        })
    }

    public async getApartmentById(apartmentId: string): Promise<BaseApartment | null> {
        return prismaManager.withConnection(async (client) => {
            const apartment = await this.apartmentRepository.getApartmentById(apartmentId, client)
            return plainToClass(BaseApartment, apartment, { excludeExtraneousValues: true })
        })
    }

    public async getAllApartmentsByBuilding(buildingId: string, para: PaginationParameter): Promise<Pagination<BaseApartment>> {
        return prismaManager.withConnection(async (client) => {
            const filter = { buildingId: buildingId }
            const options = { include: (this.apartmentRepository as any).getDefaultIncludes() }

            const source = await this.apartmentRepository.getAll(para, client, filter, options)
            const items = plainToInstance(BaseApartment, source.items, { excludeExtraneousValues: true })
            return new Pagination<BaseApartment>(items, source.totalCount, source.currentPage, source.pageSize)
        })
    }

    public async getAllApartments(para: PaginationParameter): Promise<Pagination<BaseApartment>> {
        return prismaManager.withConnection(async (client) => {
            const filter = {}
            const options = {include: (this.apartmentRepository as any).getDefaultIncludes()}

            const source = await this.apartmentRepository.getAll(para,  client, filter, options)
            const items = plainToInstance(BaseApartment, source.items, {excludeExtraneousValues: true})
            return new Pagination<BaseApartment>(items, source.totalCount, source.currentPage, source.pageSize)
        })
    }
}