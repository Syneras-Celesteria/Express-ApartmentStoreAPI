import { inject, injectable } from "inversify";
import { IZoneService } from "./interfaces/izone.service";
import { IZoneRepository } from "../repositories/interfaces/izone.repository";
import { IAreaRepository } from "../repositories/interfaces/iarea.repository";
import { Zone, CreateZoneDTO, BaseZone, UpdateZoneDTO } from "../entities/zone.entity";
import { prismaManager } from "../utils/prisma";
import { ErrorResponseV2 } from "../business_objects/error.response";
import { ErrorCode } from "../utils/enums/enums";
import { plainToClass, plainToInstance } from "class-transformer";
import { PaginationParameter, Pagination } from "../business_objects/pagination";

@injectable()
export class ZoneService implements IZoneService {
    constructor(
        @inject("IZoneRepository") private zoneRepository: IZoneRepository,
        @inject("IAreaRepository") private areaRepository: IAreaRepository,
    ) { }

    public async createZone(dto: CreateZoneDTO, currentUser: string): Promise<BaseZone> {
        return prismaManager.withTransaction(async (tx) => {
            const existingZone = await this.zoneRepository.findByName(dto.name, tx)
            if (existingZone) {
                throw new ErrorResponseV2(ErrorCode.DUPLICATE_ZONE)
            }

            const newZone = await this.zoneRepository.create(dto as Zone, currentUser, tx);
            return plainToClass(BaseZone, newZone, { excludeExtraneousValues: true })
        })
    }

    public async updateZone(zoneId: string, dto: UpdateZoneDTO, currentUser: string): Promise<BaseZone> {
        return prismaManager.withTransaction(async (tx) => {
            const zone = await this.zoneRepository.getById(zoneId, tx)
            if (!zone) {
                throw new ErrorResponseV2(ErrorCode.ZONE_NOT_FOUND)
            }

            if (dto.name && dto.name !== zone.name) {
                const existingZone = await this.zoneRepository.findByName(dto.name, tx)
                if (existingZone) {
                    throw new ErrorResponseV2(ErrorCode.DUPLICATE_ZONE)
                }
            }

            const updateZone = await this.zoneRepository.update(zoneId, currentUser, dto as Zone, tx)
            return plainToClass(BaseZone, updateZone, { excludeExtraneousValues: true })
        })
    }

    public async deleteZone(zoneId: string, currentUser: string): Promise<BaseZone> {
        return prismaManager.withTransaction(async (tx) => {
            const zone = await this.zoneRepository.getById(zoneId, tx)
            if (!zone) {
                throw new ErrorResponseV2(ErrorCode.ZONE_NOT_FOUND)
            }

            const para = new PaginationParameter(1, 1);
            const areasInZone = await this.areaRepository.getAll(para, tx, { zoneId: zoneId })
            if (areasInZone.totalCount > 0) {
                throw new ErrorResponseV2(ErrorCode.ZONE_IS_IN_USE)
            }

            const deletedZone = await this.zoneRepository.delete(zoneId, currentUser, tx)
            return plainToClass(BaseZone, deletedZone, { excludeExtraneousValues: true })
        })
    }

    public async getZoneById(zoneId: string): Promise<BaseZone | null> {
        return prismaManager.withConnection(async (client) => {
            const zone = await this.zoneRepository.getById(zoneId, client);
            return plainToClass(BaseZone, zone, { excludeExtraneousValues: true });
        });
    }

    public async getAllZones(para: PaginationParameter): Promise<Pagination<BaseZone>> {
        return prismaManager.withConnection(async (client) => {
            const source = await this.zoneRepository.getAll(para, client);
            const items = plainToInstance(BaseZone, source.items, { excludeExtraneousValues: true });
            return new Pagination<BaseZone>(items, source.totalCount, source.currentPage, source.pageSize);
        });
    }
}