import { Pagination, PaginationParameter } from "../../business_objects/pagination";
import { BaseZone, CreateZoneDTO, UpdateZoneDTO } from "../../entities/zone.entity";

export interface IZoneService {
    createZone(dto: CreateZoneDTO, currentUser: string): Promise<BaseZone>;
    updateZone(zoneId: string, dto: UpdateZoneDTO, currentUser: string): Promise<BaseZone>
    deleteZone(zoneId: string, currentUser: string): Promise<BaseZone>
    getZoneById(zoneId: string): Promise<BaseZone | null>
    getAllZones(para: PaginationParameter): Promise<Pagination<BaseZone>>
}