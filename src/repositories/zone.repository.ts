import { injectable } from "inversify";
import { GenericRepository } from "./generic.repository";
import { Zone } from "../entities/zone.entity";
import { IZoneRepository } from "./interfaces/izone.repository";
import { Client } from "../utils/prismaTypes";

@injectable()
export class ZoneRepository extends GenericRepository<Zone, 'zone'> implements IZoneRepository {
    constructor() {
        super('zone'); 
    }

    public async findByName(name: string, client: Client): Promise<Zone | null> {
        const model = this.getModel(client);
        return (model as any).findFirst({
            where: {
                name: name,
                toDate: null
            }
        });
    }
}