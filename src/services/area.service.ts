import { inject, injectable } from "inversify";
import { IAreaService } from "./interfaces/iarea.service";
import { IAreaRepository } from "../repositories/interfaces/iarea.repository";
import { IZoneRepository } from "../repositories/interfaces/izone.repository";
import { IBuildingRepository } from "../repositories/interfaces/ibuilding.repository";
import { Area, BaseArea, CreateAreaDTO, UpdateAreaDTO } from "../entities/area.entity";
import { prismaManager } from "../utils/prisma";
import { ErrorResponseV2 } from "../business_objects/error.response";
import { ErrorCode } from "../utils/enums/enums";
import { plainToClass, plainToInstance } from "class-transformer";
import { Pagination, PaginationParameter } from "../business_objects/pagination";

@injectable()
export class AreaService implements IAreaService {
    constructor(
        @inject("IAreaRepository") private areaRepository: IAreaRepository,
        @inject("IZoneRepository") private zoneRepository: IZoneRepository,
        @inject("IBuildingRepository") private buildingRepository: IBuildingRepository,
    ) { }

    public async createArea(dto: CreateAreaDTO, currentUser: string): Promise<BaseArea> {
        return prismaManager.withTransaction(async (tx) => {
            const parentZone = await this.zoneRepository.getById(dto.zoneId, tx)
            if (!parentZone) {
                throw new ErrorResponseV2(ErrorCode.ZONE_NOT_FOUND)
            }

            const newArea = await this.zoneRepository.create(dto as Area, currentUser, tx)

            const createdArea = await this.areaRepository.getById(newArea.id!, tx, { include: { zone: true } })
            return plainToClass(BaseArea, createdArea, { excludeExtraneousValues: true })
        })
    }

    public async updateArea(areaId: string, dto: UpdateAreaDTO, currentUser: string): Promise<BaseArea> {
        return prismaManager.withTransaction(async (tx) => {
            const area = await this.areaRepository.getById(areaId, tx)
            if (!area) {
                throw new ErrorResponseV2(ErrorCode.AREA_NOT_FOUND)
            }

            if (dto.zoneId && dto.zoneId !== area.zoneId) {
                const parentZone = await this.zoneRepository.getById(dto.zoneId, tx)
                if (!parentZone) {
                    throw new ErrorResponseV2(ErrorCode.ZONE_NOT_FOUND)
                }
            }

            const updatedArea = await this.areaRepository.update(areaId, currentUser, dto as Area, tx)
            const result = await this.areaRepository.getById(updatedArea.id!, tx, { include: { zone: true } })

            return plainToClass(BaseArea, result, { excludeExtraneousValues: true })
        })
    }

    public async deleteArea(areaId: string, currentUser: string): Promise<BaseArea> {
        return prismaManager.withTransaction(async (tx) => {
            const area = await this.areaRepository.getById(areaId, tx)
            if (!area) {
                throw new ErrorResponseV2(ErrorCode.AREA_NOT_FOUND)
            }

            const para = new PaginationParameter(1, 1)
            const filter = { areaId: areaId }
            const buildingsInArea = await this.buildingRepository.getAll(para, tx, filter)

            if (buildingsInArea.totalCount > 0) {
                throw new ErrorResponseV2(ErrorCode.AREA_IS_IN_USE)
            }

            const deletedArea = await this.areaRepository.delete(areaId, currentUser, tx)
            return plainToClass(BaseArea, deletedArea, { excludeExtraneousValues: true })
        })
    }

    public async getAreaById(areaId: string): Promise<BaseArea | null> {
        return prismaManager.withConnection(async (client) => {
            const area = await this.areaRepository.getById(areaId, client, {
                include: {
                    zone: true
                }
            })
            return plainToClass(BaseArea, area, { excludeExtraneousValues: true })
        })
    }

    public async getAllAreasByZone(zoneId: string, para: PaginationParameter): Promise<Pagination<BaseArea>> {
        return prismaManager.withConnection(async (client) => {
            const filter = { zoneId: zoneId }
            const source = await this.areaRepository.getAll(para, client, filter, {
                include: { zone: true }
            })

            const items = plainToInstance(BaseArea, source.items, { excludeExtraneousValues: true })

            return new Pagination<BaseArea>(items, source.totalCount, source.currentPage, source.pageSize)
        })
    }
}