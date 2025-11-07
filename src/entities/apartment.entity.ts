import { BaseEntity } from "./base/base.entity";
import { Expose, Type } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsArray, ValidateNested, Min } from "class-validator";
import { Building, BaseBuilding } from "./building.entity";
import { User, BaseUser } from "./user.entity";
import { ApartmentStatus } from "@prisma/client";

// --- Entity/DTO cho Hình ảnh ---
export class ApartmentImage extends BaseEntity {
    @Expose()
    url!: string;

    @Expose()
    apartmentId!: string;

    @Expose()
    @Type(() => Apartment)
    apartment?: Apartment | null;
}

export class BaseApartmentImage {
    @Expose()
    id!: string;
    @Expose()
    url!: string;
}

// DTO khi upload ảnh
export class CreateApartmentImageDTO {
    @IsString()
    @IsNotEmpty()
    @Expose()
    url!: string;
}

// --- Entity/DTO cho Căn hộ ---
export class Apartment extends BaseEntity {
    @Expose() description?: string | null;
    @Expose() price!: number;
    @Expose() areaSize!: number;
    @Expose() bedrooms!: number;
    @Expose() bathrooms!: number;
    @Expose() priority!: number;
    @Expose() status!: ApartmentStatus;
    @Expose() contactUserId!: string;
    @Expose() buildingId!: string;

    @Expose() @Type(() => User)
    contactUser?: User | null;
    
    @Expose() @Type(() => Building)
    building?: Building | null;
    
    @Expose() @Type(() => ApartmentImage)
    images?: ApartmentImage[] | null;
}

// DTO (Response - Trả về)
export class BaseApartment {
    @Expose() id!: string;
    @Expose() description?: string | null;
    @Expose() price!: number;
    @Expose() areaSize!: number;
    @Expose() bedrooms!: number;
    @Expose() bathrooms!: number;
    @Expose() priority!: number;
    @Expose() status!: ApartmentStatus;

    @Expose() @Type(() => BaseUser)
    contactUser?: BaseUser | null;

    @Expose() @Type(() => BaseBuilding)
    building?: BaseBuilding | null;

    @Expose() @Type(() => BaseApartmentImage)
    images?: BaseApartmentImage[] | null;
}

// DTO (Input - Tạo mới)
export class CreateApartmentDTO {
    @IsString() @IsOptional() @Expose()
    description?: string;

    @IsNumber() @Min(0) @Expose()
    price!: number;

    @IsNumber() @Min(0) @Expose()
    areaSize!: number;

    @IsNumber() @Min(0) @Expose()
    bedrooms!: number;

    @IsNumber() @Min(0) @Expose()
    bathrooms!: number;
    
    @IsNumber() @IsOptional() @Min(0) @Expose()
    priority?: number;

    @IsEnum(ApartmentStatus) @IsOptional() @Expose()
    status?: ApartmentStatus;

    @IsString() @IsNotEmpty() @Expose()
    contactUserId!: string;

    @IsString() @IsNotEmpty() @Expose()
    buildingId!: string;

    // Cho phép gửi kèm 1 mảng các URL ảnh
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateApartmentImageDTO)
    @Expose()
    images?: CreateApartmentImageDTO[];
}

// DTO (Input - Cập nhật)
export class UpdateApartmentDTO {
    @IsString() @IsOptional() @Expose()
    description?: string;
    
    @IsNumber() @IsOptional() @Min(0) @Expose()
    price?: number;
    
    @IsNumber() @IsOptional() @Min(0) @Expose()
    areaSize?: number;
    
    @IsNumber() @IsOptional() @Min(0) @Expose()
    bedrooms?: number;
    
    @IsNumber() @IsOptional() @Min(0) @Expose()
    bathrooms?: number;
    
    @IsNumber() @IsOptional() @Min(0) @Expose()
    priority?: number;
    
    @IsEnum(ApartmentStatus) @IsOptional() @Expose()
    status?: ApartmentStatus;
    
    @IsString() @IsOptional() @Expose()
    contactUserId?: string;
    
    @IsString() @IsOptional() @Expose()
    buildingId?: string;
}