import { Pagination, PaginationParameter } from "../../business_objects/pagination";
import { BaseApartment, CreateApartmentDTO, UpdateApartmentDTO } from "../../entities/apartment.entity";

export interface IApartmentService {
    createApartment(dto: CreateApartmentDTO, currentUser: string): Promise<BaseApartment>
    updateApartment(apartmentId: string, dto: UpdateApartmentDTO, currentUser: string): Promise<BaseApartment>
    deleteApartment(apartmentId: string, currentUser: string): Promise<BaseApartment>
    getApartmentById(apartmentId: string): Promise<BaseApartment | null>;
    getAllApartmentsByBuilding(buildingId: string, para: PaginationParameter): Promise<Pagination<BaseApartment>>;
    getAllApartments(para: PaginationParameter): Promise<Pagination<BaseApartment>>
}