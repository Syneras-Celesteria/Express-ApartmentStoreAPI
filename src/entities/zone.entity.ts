import { BaseEntity } from "./base/base.entity";
import { Expose, Type } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { Area } from "./area.entity";

// 1. Entity (Map với DB)
export class Zone extends BaseEntity {
    @Expose()
    name!: string;

    @Expose()
    desc?: string | null;

    @Expose()
    @Type(() => Area)
    areas?: Area[] | null;
}

// 2. DTO (Response - Trả về)
export class BaseZone {
    @Expose()
    id!: string; // (Kế thừa từ BaseEntity)

    @Expose()
    name!: string;

    @Expose()
    desc?: string | null;
}

// 3. DTO (Input - Tạo mới)
export class CreateZoneDTO {
    @IsString()
    @IsNotEmpty()
    @Expose()
    name!: string;

    @IsString()
    @IsOptional()
    @Expose()
    desc?: string;
}

// 4. DTO (Input - Cập nhật)
export class UpdateZoneDTO {
    @IsString()
    @IsOptional()
    @Expose()
    name?: string;

    @IsString()
    @IsOptional()
    @Expose()
    desc?: string;
}