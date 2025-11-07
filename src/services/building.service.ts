import { inject, injectable } from "inversify";
import { IBuildingService } from "./interfaces/ibuilding.service";
import { IBuildingRepository } from "../repositories/interfaces/ibuilding.repository";
import { IAreaRepository } from "../repositories/interfaces/iarea.repository";
import { IApartmentRepository } from "../repositories/interfaces/iapartment.repository";
import { Building, CreateBuildingDTO, BaseBuilding, UpdateBuildingDTO } from "../entities/building.entity";
import { prismaManager } from "../utils/prisma";
import { ErrorResponseV2 } from "../business_objects/error.response";
import { ErrorCode } from "../utils/enums/enums";
import { plainToClass, plainToInstance } from "class-transformer";
import { Pagination, PaginationParameter } from "../business_objects/pagination";

@injectable()
export class BuildingService implements IBuildingService {
    constructor(
        @inject("IBuildingRepository") private buildingRepository: IBuildingRepository,
        @inject("IAreaRepository") private areaRepository: IAreaRepository,
        @inject("IApartmentRepository") private apartmentRepository: IApartmentRepository,
    ) { }

    public async createBuilding(dto: CreateBuildingDTO, currentUser: string): Promise<BaseBuilding> {
        return prismaManager.withTransaction(async (tx) => {
            const parentArea = await this.areaRepository.getById(dto.areaId, tx);
            if (!parentArea) {
                throw new ErrorResponseV2(ErrorCode.AREA_NOT_FOUND)
            }

            const newBuilding = await this.buildingRepository.create(dto as Building, currentUser, tx)
            const createdBuilding = await this.buildingRepository.getById(newBuilding.id!, tx, {
                include: {
                    area: {
                        include: {
                            zone: true
                        }
                    }
                }
            })
            return plainToClass(BaseBuilding, createdBuilding, { excludeExtraneousValues: true })
        })
    }

    public async updateBuilding(buildingId: string, dto: UpdateBuildingDTO, currentUser: string): Promise<BaseBuilding> {
        return prismaManager.withTransaction(async (tx) => {
            const building = await this.buildingRepository.getById(buildingId, tx);
            if (!building) {
                throw new ErrorResponseV2(ErrorCode.BUILDING_NOT_FOUND)
            }

            if (dto.areaId && dto.areaId !== building.areaId) {
                const parentArea = await this.areaRepository.getById(dto.areaId, tx)
                if (!parentArea) {
                    throw new ErrorResponseV2(ErrorCode.AREA_NOT_FOUND)
                }
            }

            const updatedBuilding = await this.buildingRepository.update(buildingId, currentUser, dto as Building, tx)
            const result = await this.buildingRepository.getById(updatedBuilding.id!, tx, {
                include: {
                    area: {
                        include: {
                            zone: true
                        }
                    }
                }
            })

            return plainToClass(BaseBuilding, result, { excludeExtraneousValues: true })
        })
    }

    public async deleteBuilding(buildingId: string, currentUser: string): Promise<BaseBuilding> {
        return prismaManager.withTransaction(async (tx) => {
            const building = await this.buildingRepository.getById(buildingId, tx)
            if (!building) {
                throw new ErrorResponseV2(ErrorCode.BUILDING_NOT_FOUND)
            }

            const para = new PaginationParameter(1, 1);
            const filter = { buildingId: buildingId }
            const apartmentsInBuilding = await this.apartmentRepository.getAll(para, tx, filter)

            if (apartmentsInBuilding.totalCount > 0) {
                throw new ErrorResponseV2(ErrorCode.BUILDING_IS_IN_USE)
            }

            const deletedBuilding = await this.buildingRepository.delete(buildingId, currentUser, tx)
            return plainToClass(BaseBuilding, deletedBuilding, { excludeExtraneousValues: true })
        })
    }

    public async getBuildingById(buildingId: string): Promise<BaseBuilding> {
        return prismaManager.withConnection(async (client) => {
            const building = await this.buildingRepository.getById(buildingId, client, {
                include: {
                    area: {
                        include: {
                            zone: true
                        }
                    }
                }
            })

            return plainToClass(BaseBuilding, building, { excludeExtraneousValues: true })
        })
    }

    public async getAllBuildingsByArea(areaId: string, para: PaginationParameter): Promise<Pagination<BaseBuilding>> {
        return prismaManager.withConnection(async (client) => {
            const filter = { areaId: areaId };
            const options = {
                include: {
                    area: { include: { zone: true } }
                }
            }

            const source = await this.buildingRepository.getAll(para, client, filter, options)

            const items = plainToInstance(BaseBuilding, source.items, { excludeExtraneousValues: true })
            return new Pagination<BaseBuilding>(items, source.totalCount, source.currentPage, source.pageSize)
        })
    }


}