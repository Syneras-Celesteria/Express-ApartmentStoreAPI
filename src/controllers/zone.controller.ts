import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { IZoneService } from "../services/interfaces/izone.service";
import { Route, Get, Post, Tags, Body, Controller, Put, Delete, Path, Security, Request, Query } from "tsoa";
import { CreateZoneDTO, UpdateZoneDTO } from "../entities/zone.entity";
import { GeneralResponse } from "../business_objects/general.response";
import { SuccessCode } from "../utils/enums/enums";
import { validate } from "../utils/password/validate";
import { PaginationParameter } from "../business_objects/pagination";

@Route("zones")
@Tags("Zone Management")
@controller("zones")
@Security("jwt", ["ADMIN"]) // Bảo mật toàn bộ Controller
export class ZoneController extends Controller {
    
    constructor(@inject("IZoneService") private readonly zoneService: IZoneService) {
        super(); 
    }

    /**
     * Tạo Phân khu (Zone) mới
     */
    @Post("/")
    @httpPost("/")
    public async createZone(@Body() dto: CreateZoneDTO, @Request() req: any): Promise<GeneralResponse> {
        await validate(CreateZoneDTO, dto);
        const currentUser = req.user.username; // Lấy admin user từ JWT
        const newZone = await this.zoneService.createZone(dto, currentUser);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, newZone);
    }

    /**
     * Cập nhật Phân khu
     */
    @Put("/{zoneId}")
    @httpPut("/:zoneId")
    public async updateZone(@Path() zoneId: string, @Body() dto: UpdateZoneDTO, @Request() req: any): Promise<GeneralResponse> {
        await validate(UpdateZoneDTO, dto);
        const currentUser = req.user.username;
        const updatedZone = await this.zoneService.updateZone(zoneId, dto, currentUser);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, updatedZone);
    }

    /**
     * Xóa mềm Phân khu
     */
    @Delete("/{zoneId}")
    @httpDelete("/:zoneId")
    public async deleteZone(@Path() zoneId: string, @Request() req: any): Promise<GeneralResponse> {
        const currentUser = req.user.username;
        const deletedZone = await this.zoneService.deleteZone(zoneId, currentUser);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, deletedZone);
    }

    /**
     * Lấy Phân khu bằng ID
     */
    @Get("/{zoneId}")
    @httpGet("/:zoneId")
    public async getZoneById(@Path() zoneId: string): Promise<GeneralResponse> {
        const zone = await this.zoneService.getZoneById(zoneId);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, zone);
    }

    /**
     * Lấy tất cả Phân khu (phân trang)
     */
    @Get("/")
    @httpGet("/")
    public async getAllZones(@Query() pageIndex?: number, @Query() pageSize?: number): Promise<GeneralResponse> {
        const para = new PaginationParameter(pageIndex, pageSize);
        const zones = await this.zoneService.getAllZones(para);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, zones);
    }
}