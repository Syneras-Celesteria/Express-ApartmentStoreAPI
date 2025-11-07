import { injectable } from "inversify";
import { GenericRepository } from "./generic.repository";
import { IApartmentImageRepository } from "./interfaces/iapartmentImage.repository";
import { ApartmentImage } from "../entities/apartment.entity";

@injectable()
export class ApartmentImageRepository extends GenericRepository<ApartmentImage, 'apartmentImage'> implements IApartmentImageRepository {
    constructor() {
        super('apartmentImage')
    }
}