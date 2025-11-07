import { Expose } from "class-transformer";
import { BaseEntity } from "./base/base.entity";
import { User } from "./user.entity";
import { Role } from "./role.entity";

export class UserRole extends BaseEntity {
    @Expose()
    userId!: string;

    @Expose()
    roleId!: string;

    @Expose()
    user?: User | null;

    @Expose()
    role?: Role | null;
}