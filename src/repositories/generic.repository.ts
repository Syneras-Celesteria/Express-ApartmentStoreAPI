import { injectable, unmanaged } from "inversify";
import { IGenericRepository } from "./interfaces/igeneric.repository";
import { BaseEntity } from "../entities/base/base.entity";
import { Pagination, PaginationParameter } from "../business_objects/pagination";
import { PrismaModels, ModelClient, Client } from "../utils/prismaTypes";


@injectable()
export class GenericRepository<T extends BaseEntity, M extends PrismaModels = PrismaModels> implements IGenericRepository<T> {
    protected readonly entity: M;

    constructor(@unmanaged() entity: M) {
        this.entity = entity;
    }

    protected getModel(client: Client): ModelClient<M> {
        return (client as any)[this.entity];
    }

    protected getActiveQuery(): object {
        return {
            toDate: null,
            fromDate: {
                lte: new Date()
            }
        }
    }

    async getAll(para: PaginationParameter, client: Client, filter: object = {}, options: any = {}): Promise<Pagination<T>> {
        const model = this.getModel(client);
        const skip = (para.pageIndex - 1) * para.pageSize;

        const baseWhere = this.getActiveQuery()
        const whereQuery = { ...baseWhere, ...filter }


        const [items, count] = await Promise.all([
            (model as any).findMany({
                skip,
                take: para.pageSize,
                where: whereQuery,
                ...options
            }),
            (model as any).count({
                where: whereQuery
            })
        ]);
        return new Pagination<T>(items, count, para.pageIndex, para.pageSize);
    };

    async getById(id: string, client: Client, options: any = {}): Promise<T | null> {
        const model = this.getModel(client);
        return await (model as any).findFirst({
            where: {
                id,
                ...this.getActiveQuery()
            },
            ...options
        });
    };

    async create(data: T, currentUser: string, client: Client): Promise<T> {
        const model = this.getModel(client);

        data.createBy = currentUser;
        data.updateBy = currentUser;

        return await (model as any).create({
            data: data,
        });
    };

    async update(id: string, currentUser: string, data: Partial<T>, client: Client): Promise<T> {
        const model = this.getModel(client);

        data.updateBy = currentUser;

        return await (model as any).update({
            where: { id: id },
            data: data,
        });
    };


    async delete(id: string, currentUser: string, client: Client): Promise<T> {
        const model = this.getModel(client);
        return await (model as any).update({
            where: { id: id },
            data: { toDate: new Date(), updateBy: currentUser }
        });
    }

    async restore(id: string, currentUser: string, client: Client): Promise<T> {
        const model = this.getModel(client);
        return await (model as any).update({
            where: { id: id },
            data: { toDate: null, updateBy: currentUser }
        })
    }
}
