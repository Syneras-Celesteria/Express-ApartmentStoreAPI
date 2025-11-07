import { injectable } from "inversify";
import { GenericRepository } from "./generic.repository";
import { Apartment, CreateApartmentDTO } from "../entities/apartment.entity";
import { IApartmentRepository } from "./interfaces/iapartment.repository";
import { Client } from "../utils/prismaTypes";

@injectable()
export class ApartmentRepository extends GenericRepository<Apartment, 'apartment'> implements IApartmentRepository {
    constructor() {
        super('apartment')
    }
    
    private getDefaultIncludes() {
        return {
            building: {
                include: {
                    area: {
                        include: {
                            zone: true
                        }
                    }
                }
            },
            contactUser: {
                select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    avatar: true
                }
            },
            images: {
                where: { toDate: null}
            }
        }
    }

    public async createApartment(dto: CreateApartmentDTO, currentUser: string, client: Client): Promise<Apartment> {
        const model = this.getModel(client);

        const {images, ...apartmentData } = dto;
        return (model as any).create({
            data: {
                ...apartmentData,

                createBy: currentUser,
                updateBy: currentUser,

                images: images && images.length > 0 ? {
                    create: images.map(imgDto => ({
                        url: imgDto.url,
                        createBy: currentUser,
                        updateBy: currentUser,
                    }))
                } : undefined
            },
            include: this.getDefaultIncludes()
        })
    }

    public async getApartmentById(id: string, client: Client): Promise<Apartment | null> {
        const model = this.getModel(client);
        return (model as any).findFirst({
            where: {
                id: id,
                ...this.getActiveQuery()
            },
            include: this.getDefaultIncludes()
        })
    }
}