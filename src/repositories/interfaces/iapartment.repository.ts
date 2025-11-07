import { Apartment, CreateApartmentDTO } from "../../entities/apartment.entity";
import { IGenericRepository } from "./igeneric.repository";
import { Client } from "../../utils/prismaTypes";

export interface IApartmentRepository extends IGenericRepository<Apartment> {
    createApartment(
        dto: CreateApartmentDTO, 
        currentUser: string, 
        client: Client
    ): Promise<Apartment>;

    getApartmentById(id: string, client: Client): Promise<Apartment | null>;

    // (Bạn có thể thêm hàm getAllApartments(para, client)
}