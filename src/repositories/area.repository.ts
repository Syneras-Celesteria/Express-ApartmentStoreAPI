import { injectable } from "inversify";
import { GenericRepository } from "./generic.repository";
import { IAreaRepository } from "./interfaces/iarea.repository";
import { Area } from "../entities/area.entity";

@injectable()
export class AreaRepository extends GenericRepository<Area, 'area'> implements IAreaRepository {
    constructor() {
        super('area');
    }

}