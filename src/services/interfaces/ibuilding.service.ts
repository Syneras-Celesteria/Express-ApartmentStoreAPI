import { Pagination, PaginationParameter } from "../../business_objects/pagination";
import { BaseBuilding, CreateBuildingDTO, UpdateBuildingDTO } from "../../entities/building.entity";

export interface IBuildingService {
    createBuilding(dto: CreateBuildingDTO, currentUser: string): Promise<BaseBuilding>
    updateBuilding(buildingId: string, dto: UpdateBuildingDTO, currentUser: string): Promise<BaseBuilding>
    deleteBuilding(buildingId: string, currentUser: string): Promise<BaseBuilding>
    getBuildingById(buildingId: string): Promise<BaseBuilding>
    getAllBuildingsByArea(areaId: string, para: PaginationParameter): Promise<Pagination<BaseBuilding>>
}