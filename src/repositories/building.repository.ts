import { injectable } from "inversify";
import { GenericRepository } from "./generic.repository";
import { IBuildingRepository } from "./interfaces/ibuilding.repository";
import { Building } from "../entities/building.entity";

@injectable()
export class BuildingRepository extends GenericRepository<Building, 'building'> implements IBuildingRepository {
    constructor() {
        super('building')
    }
}