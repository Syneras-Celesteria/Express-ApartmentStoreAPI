import { BaseEntity } from "./base/base.entity";
import { IsString, MinLength, IsNumber, IsEmail, IsPhoneNumber, IsEnum, IsOptional } from "class-validator";
import { Match } from "../utils/password/validate";
import { Gender } from "@prisma/client";
import { Expose, Type } from "class-transformer";
import { UserRole } from "./userRole.entity"; 

// --- 1. ENTITY (Map với DB) ---
export class User extends BaseEntity {
    @Expose()
    firstName?: string | null;

    @Expose()
    lastName?: string | null;

    @Expose()
    username!: string;

    @Expose()
    email?: string | null;

    @Expose()
    emailVerified?: boolean;

    @Expose()
    phone?: string | null;

    @Expose()
    age?: number | null;

    @Expose()
    gender?: Gender | null;

    @Expose()
    avatar?: string | null;

    @Expose()
    @Type(() => UserRole)
    userRoles?: UserRole[] | null

    @Expose()
    password!: string;
}

// --- 2. DTO (Data Transfer Objects) ---
export class BaseUser {
    @Expose()
    id!: string;

    @Expose()
    firstName?: string | null;

    @Expose()
    lastName?: string | null;

    @Expose()
    username!: string;

    @Expose()
    email?: string | null;

    @Expose()
    phone?: string | null;

    @Expose()
    age?: number | null;

    @Expose()
    gender?: Gender | null;

    @Expose()
    avatar?: string | null;

    // Giả sử chúng ta chỉ trả về tên của Role
    @Expose()
    roles?: string[]; 
}

// DTO cho Public Sign-up 
export class CreateUserDTO {
    @Expose()
    @IsString()
    username!: string;

    @IsOptional()
    @Expose()
    @IsEmail()
    email?: string;

    @IsOptional()
    @Expose()
    @IsPhoneNumber()
    phone?: string;

    @IsString()
    @MinLength(7, { message: "Password must be at least 7 characters long" })
    password!: string;

    @IsString()
    @MinLength(7, { message: "Password must be at least 7 characters long" })
    @Match("password")
    confirmPassword?: string;
}

// DTO cho Admin Sign-up
export class InternalCreateUserDTO extends CreateUserDTO {
    @IsString()
    @Expose()
    roleName!: string; 
}


// DTO Đăng nhập 
export class AuthRequest {
    @IsString()
    @Expose()
    identifier!: string;

    @IsString()
    @MinLength(7, { message: "Password must be at least 7 characters long" })
    password!: string;
}

// DTO Refresh Token 
export class RefreshTokenRequest {
    refreshToken!: string;
}

// DTO Trả về của Auth
export class AuthResponse {
    accessToken!: string;
    refreshToken!: string;
}

// DTO Cập nhật
export class UpdateUserDTO {
    @IsOptional()
    @Expose()
    firstName?: string;

    @IsOptional()
    @Expose()
    lastName?: string;

    @IsOptional()
    @IsEmail()
    @Expose()
    email?: string

    @IsOptional()
    @Expose()
    @IsPhoneNumber()
    phone?: string;

    @IsOptional()
    @Expose()
    @IsNumber()
    age?: number; 

    @IsOptional()
    @Expose()
    @IsEnum(Gender)
    gender?: Gender;

    @IsOptional()
    @Expose()
    avatar?: string;
}

// DTO Đổi mật khẩu 
export class ChangePassword {
    @Expose()
    lastPassword!: string;

    @Expose()
    newPassword!: string;

    @Expose()
    @Match("newPassword")
    confirmPassword!: string;
}

// DTO Đổi Email (On Update)
export class ChangeEmail {
    @Expose()
    currentEmail!: string;

    @Expose()
    newEmail!: string;
}

// Business Object
export interface UserEmail {
    email: string
}