import { inject, injectable } from "inversify";
import { AuthRequest, AuthResponse, RefreshTokenRequest } from "../entities/user.entity";
import { IUserRepository } from "../repositories/interfaces/iuser.repository";
import { IAuthService } from "./interfaces/iauth.service";
import { PasswordUtil } from "../utils/password/password.util";
import { ErrorResponseV2 } from "../business_objects/error.response";
import { AuthUtil } from "../utils/password/auth.util";
import { ErrorCode } from "../utils/enums/enums";
import config from "../utils/environments/environment";
import * as jwt from "jsonwebtoken";
import { prismaManager } from "../utils/prisma";

@injectable()
export class AuthService implements IAuthService {
    constructor(@inject("IUserRepository") private userRepository: IUserRepository) { }

    public async login(loginData: AuthRequest): Promise<AuthResponse> {
        return prismaManager.withConnection(async (client) => {
            var user = await this.userRepository.findByIdentifier(loginData.identifier, client);
            if (!user || !user.id) {
                throw new ErrorResponseV2(ErrorCode.INVALID_CREDENTIALS);
            }

            var isValidPassword = await PasswordUtil.comparePassword(loginData.password, user.password);
            if (!isValidPassword) {
                throw new ErrorResponseV2(ErrorCode.INVALID_CREDENTIALS);
            }
            return AuthUtil.generateAuthToken(user);
        })

    }

    public async refreshToken(refreshData: RefreshTokenRequest): Promise<AuthResponse> {
        var tokenData: any
        try {
            tokenData = jwt.verify(refreshData.refreshToken, config.auth.jwtSecret) as { email: string, type: string };
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new ErrorResponseV2(ErrorCode.EXPIRED_TOKEN);
            }
            throw new ErrorResponseV2(ErrorCode.INVALID_REQUEST);
        }

        if (tokenData.email && tokenData.type == "refresh") {

            return prismaManager.withConnection(async (client) => {
                var user = await this.userRepository.getByEmail(tokenData.email, client);

                if (!user || !user.id) {
                    throw new ErrorResponseV2(ErrorCode.INVALID_TOKEN_CLAIM);
                }
                return AuthUtil.generateAuthToken(user);
            });

        } else {
            throw new ErrorResponseV2(ErrorCode.INVALID_TOKEN_TYPE);
        }
    }
}