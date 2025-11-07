import { BaseEntity } from "./base/base.entity";
import { Expose, Type } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { Zone, BaseZone } from "./zone.entity";
import { Building } from "./building.entity";

// 1. Entity (Map với DB)
export class Area extends BaseEntity {
    @Expose()
    name!: string;

    @Expose()
    zoneId!: string;

    @Expose()
    @Type(() => Zone)
    zone?: Zone | null;

    @Expose()
    @Type(() => Building)
    buildings?: Building[] | null;
}

// 2. DTO (Response - Trả về)
export class BaseArea {
    @Expose()
    id!: string;

    @Expose()
    name!: string;

    // Trả về thông tin cơ bản của Phân khu
    @Expose()
    @Type(() => BaseZone) 
    zone?: BaseZone | null;
}

// 3. DTO (Input - Tạo mới)
export class CreateAreaDTO {
    @IsString()
    @IsNotEmpty()
    @Expose()
    name!: string;

    // Khi tạo Khu vực, phải biết nó thuộc Phân khu (Zone) nào
    @IsString()
    @IsNotEmpty()
    @Expose()
    zoneId!: string;
}

// 4. DTO (Input - Cập nhật)
export class UpdateAreaDTO {
    @IsString()
    @IsOptional()
    @Expose()
    name?: string;

    @IsString()
    @IsOptional()
    @Expose()
    zoneId?: string;
}