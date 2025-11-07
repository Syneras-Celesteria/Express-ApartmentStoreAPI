import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { IAreaService } from "../services/interfaces/iarea.service";
import { Route, Get, Post, Tags, Body, Controller, Put, Delete, Path, Security, Request, Query } from "tsoa";
import { CreateAreaDTO, UpdateAreaDTO } from "../entities/area.entity";
import { GeneralResponse } from "../business_objects/general.response";
import { SuccessCode } from "../utils/enums/enums";
import { validate } from "../utils/password/validate";
import { PaginationParameter } from "../business_objects/pagination";

@Route("areas")
@Tags("Area Management")
@controller("areas")
@Security("jwt", ["ADMIN"]) // Bảo mật toàn bộ Controller
export class AreaController extends Controller {
    
    constructor(@inject("IAreaService") private readonly areaService: IAreaService) {
        super(); 
    }

    /**
     * Tạo Khu vực (Area) mới
     */
    @Post("/")
    @httpPost("/")
    public async createArea(@Body() dto: CreateAreaDTO, @Request() req: any): Promise<GeneralResponse> {
        await validate(CreateAreaDTO, dto);
        const currentUser = req.user.username;
        const newArea = await this.areaService.createArea(dto, currentUser);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, newArea);
    }

    /**
     * Cập nhật Khu vực
     */
    @Put("/{areaId}")
    @httpPut("/:areaId")
    public async updateArea(@Path() areaId: string, @Body() dto: UpdateAreaDTO, @Request() req: any): Promise<GeneralResponse> {
        await validate(UpdateAreaDTO, dto);
        const currentUser = req.user.username;
        const updatedArea = await this.areaService.updateArea(areaId, dto, currentUser);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, updatedArea);
    }

    /**
     * Xóa mềm Khu vực
     */
    @Delete("/{areaId}")
    @httpDelete("/:areaId")
    public async deleteArea(@Path() areaId: string, @Request() req: any): Promise<GeneralResponse> {
        const currentUser = req.user.username;
        const deletedArea = await this.areaService.deleteArea(areaId, currentUser);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, deletedArea);
    }

    /**
     * Lấy Khu vực bằng ID
     */
    @Get("/{areaId}")
    @httpGet("/:areaId")
    public async getAreaById(@Path() areaId: string): Promise<GeneralResponse> {
        const area = await this.areaService.getAreaById(areaId);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, area);
    }

    /**
     * Lấy tất cả Khu vực theo Phân khu (Zone)
     */
    @Get("/by-zone/{zoneId}")
    @httpGet("/by-zone/:zoneId")
    public async getAllAreasByZone(
        @Path() zoneId: string, 
        @Query() pageIndex?: number, 
        @Query() pageSize?: number
    ): Promise<GeneralResponse> {
        const para = new PaginationParameter(pageIndex, pageSize);
        const areas = await this.areaService.getAllAreasByZone(zoneId, para);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, areas);
    }
}