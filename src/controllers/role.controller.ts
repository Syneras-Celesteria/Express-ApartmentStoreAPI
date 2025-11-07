import { controller, httpDelete, httpGet, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { IRoleService } from "../services/interfaces/irole.service";
import { Route, Get, Post, Tags, Body, Controller, Put, Delete, Path, Security, Request } from "tsoa";
import { CreateRoleDTO } from "../entities/role.entity";
import { GeneralResponse } from "../business_objects/general.response";
import { SuccessCode } from "../utils/enums/enums";
import { validate } from "../utils/password/validate";

@Route("roles")
@Tags("Role Management")
@controller("roles")
export class RoleController extends Controller {
    constructor(@inject("IRoleService") private readonly roleService: IRoleService) {
        super();
    }

    /**
     * Tạo một vai trò (Role) mới.
     * Chỉ Admin.
     * @param dto Thông tin Role (name, desc)
     */
    @Post("/")
    @httpPost("/")
    @Security("jwt", ["ADMIN"])
    public async createRole(@Request() req: any, @Body() dto: CreateRoleDTO): Promise<GeneralResponse> {
        await validate(CreateRoleDTO, dto);

        const adminUser = req.user.username
        const newRole = await this.roleService.createRole(dto, adminUser);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, newRole);
    }

    /**
     * Lấy thông tin Role bằng Tên.
     * Chỉ Admin.
     * @param roleName Tên của vai trò (ví dụ: "USER")
     */
    @Get("/{roleName}")
    @httpGet("/:roleName") // (Dùng ':' cho inversify-express-utils)
    @Security("jwt", ["ADMIN"])
    public async getRole(@Path() roleName: string): Promise<GeneralResponse> {
        const role = await this.roleService.getRoleByName(roleName);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, role);
    }

    /**
     * Xóa mềm một vai trò (Role).
     * Chỉ Admin.
     * @param roleName Tên của vai trò (ví dụ: "MANAGER")
     */
    @Delete("/{roleName}")
    @httpDelete("/:roleName")
    @Security("jwt", ["ADMIN"])
    public async deleteRole(@Request() req: any, @Path() roleName: string): Promise<GeneralResponse> {
        const adminUser = req.user.username
        const deletedRole = await this.roleService.deleteRole(roleName, adminUser);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, deletedRole);
    }
}