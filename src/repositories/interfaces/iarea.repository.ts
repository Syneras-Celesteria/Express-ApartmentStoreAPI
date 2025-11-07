import { Area } from "../../entities/area.entity";
import { IGenericRepository } from "./igeneric.repository";

export interface IAreaRepository extends IGenericRepository<Area> {
    // Có thể thêm 'findByNameAndZoneId' sau nếu cần
}