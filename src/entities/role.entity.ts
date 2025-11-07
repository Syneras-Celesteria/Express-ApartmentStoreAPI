import { Expose } from "class-transformer";
import { BaseEntity } from "./base/base.entity"
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserRole } from "./userRole.entity";

export class Role extends BaseEntity {
    @Expose()
    name!: string;

    @Expose()
    desc?: string | null;

    @Expose()
    userRoles?: UserRole[] | null
}

export class BaseRole {
    @Expose()
    id!: string;

    @Expose()
    name!: string;

    @Expose()
    desc?: string;
}

export class CreateRoleDTO {
    @IsString()
    @IsNotEmpty()
    @Expose()
    name!: string;

    @IsString()
    @IsOptional()
    desc?: string;
}

export class UpdateRoleDTO {
    @IsString()
    @IsOptional()
    @Expose()
    name?: string;

    @IsString()
    @IsOptional()
    @Expose()
    desc?: string;
}