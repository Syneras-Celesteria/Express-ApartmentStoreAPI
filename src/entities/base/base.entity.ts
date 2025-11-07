import { Exclude, Expose, Type } from "class-transformer";

export class BaseEntity {
    @Expose()
    id?: string;
    @Exclude()
    createBy?: string | null;
    @Exclude()
    createAt?: Date;
    @Exclude()
    updateBy?: string | null;
    @Exclude()
    updateAt?: Date;
    @Expose()
    fromDate?: Date | null;
    @Expose()
    toDate?: Date | null;
}