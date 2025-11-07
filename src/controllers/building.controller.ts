import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { IBuildingService } from "../services/interfaces/ibuilding.service";
import { Route, Get, Post, Tags, Body, Controller, Put, Delete, Path, Security, Request, Query } from "tsoa";
import { CreateBuildingDTO, UpdateBuildingDTO } from "../entities/building.entity";
import { GeneralResponse } from "../business_objects/general.response";
import { SuccessCode } from "../utils/enums/enums";
import { validate } from "../utils/password/validate";
import { PaginationParameter } from "../business_objects/pagination";

@Route("buildings")
@Tags("Building Management")
@controller("buildings")
@Security("jwt", ["ADMIN"]) // Bảo mật toàn bộ Controller
export class BuildingController extends Controller {
    
    constructor(@inject("IBuildingService") private readonly buildingService: IBuildingService) {
        super(); 
    }

    /**
     * Tạo Tòa nhà (Building) mới
     */
    @Post("/")
    @httpPost("/")
    public async createBuilding(@Body() dto: CreateBuildingDTO, @Request() req: any): Promise<GeneralResponse> {
        await validate(CreateBuildingDTO, dto);
        const currentUser = req.user.username;
        const newBuilding = await this.buildingService.createBuilding(dto, currentUser);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, newBuilding);
    }

    /**
     * Cập nhật Tòa nhà
     */
    @Put("/{buildingId}")
    @httpPut("/:buildingId")
    public async updateBuilding(@Path() buildingId: string, @Body() dto: UpdateBuildingDTO, @Request() req: any): Promise<GeneralResponse> {
        await validate(UpdateBuildingDTO, dto);
        const currentUser = req.user.username;
        const updatedBuilding = await this.buildingService.updateBuilding(buildingId, dto, currentUser);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, updatedBuilding);
    }

    /**
     * Xóa mềm Tòa nhà
     */
    @Delete("/{buildingId}")
    @httpDelete("/:buildingId")
    public async deleteBuilding(@Path() buildingId: string, @Request() req: any): Promise<GeneralResponse> {
        const currentUser = req.user.username;
        const deletedBuilding = await this.buildingService.deleteBuilding(buildingId, currentUser);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, deletedBuilding);
    }

    /**
     * Lấy Tòa nhà bằng ID
     */
    @Get("/{buildingId}")
    @httpGet("/:buildingId")
    public async getBuildingById(@Path() buildingId: string): Promise<GeneralResponse> {
        const building = await this.buildingService.getBuildingById(buildingId);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, building);
    }

    /**
     * Lấy tất cả Tòa nhà theo Khu vực (Area)
     */
    @Get("/by-area/{areaId}")
    @httpGet("/by-area/:areaId")
    public async getAllBuildingsByArea(
        @Path() areaId: string, 
        @Query() pageIndex?: number, 
        @Query() pageSize?: number
    ): Promise<GeneralResponse> {
        const para = new PaginationParameter(pageIndex, pageSize);
        const buildings = await this.buildingService.getAllBuildingsByArea(areaId, para);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, buildings);
    }
}