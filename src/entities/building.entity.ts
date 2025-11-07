import { BaseEntity } from "./base/base.entity";
import { Expose, Type } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { Area, BaseArea } from "./area.entity";
import { Apartment } from "./apartment.entity";

// 1. Entity (Map với DB)
export class Building extends BaseEntity {
    @Expose()
    name!: string;

    @Expose()
    areaId!: string;

    @Expose()
    @Type(() => Area)
    area?: Area | null;
    
    @Expose()
    @Type(() => Apartment)
    apartments?: Apartment[] | null;
}

// 2. DTO (Response - Trả về)
export class BaseBuilding {
    @Expose()
    id!: string;

    @Expose()
    name!: string;

    @Expose()
    @Type(() => BaseArea)
    area?: BaseArea | null;
}

// 3. DTO (Input - Tạo mới)
export class CreateBuildingDTO {
    @IsString()
    @IsNotEmpty()
    @Expose()
    name!: string;

    // Phải biết nó thuộc Khu vực (Area) nào
    @IsString()
    @IsNotEmpty()
    @Expose()
    areaId!: string;
}

// 4. DTO (Input - Cập nhật)
export class UpdateBuildingDTO {
    @IsString()
    @IsOptional()
    @Expose()
    name?: string;

    @IsString()
    @IsOptional()
    @Expose()
    areaId?: string;
}