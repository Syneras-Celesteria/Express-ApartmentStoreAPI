import { Zone } from "../../entities/zone.entity";
import { IGenericRepository } from "./igeneric.repository";
import { Client } from "../../utils/prismaTypes";

export interface IZoneRepository extends IGenericRepository<Zone> {
    findByName(name: string, client: Client): Promise<Zone | null>;
}