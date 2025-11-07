import { Pagination, PaginationParameter } from "../../business_objects/pagination";
import { BaseArea, CreateAreaDTO, UpdateAreaDTO } from "../../entities/area.entity";

export interface IAreaService {
    createArea(dto: CreateAreaDTO, currentUser: string): Promise<BaseArea>
    updateArea(areaId: string, dto: UpdateAreaDTO, currentUser: string): Promise<BaseArea>
    deleteArea(areaId: string, currentUser: string): Promise<BaseArea>
    getAreaById(areaId: string): Promise<BaseArea | null>
    getAllAreasByZone(zoneId: string, para: PaginationParameter): Promise<Pagination<BaseArea>>
}