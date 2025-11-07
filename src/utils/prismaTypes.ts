import { PrismaClient } from '@prisma/client';
import { PrismaTransactionClient } from './prisma';

export type PrismaModels = keyof Omit<PrismaClient, symbol | `$${string}`>;
export type ModelClient<T extends PrismaModels> = PrismaClient[T];
export type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
export type Client = PrismaClient | PrismaTransactionClient