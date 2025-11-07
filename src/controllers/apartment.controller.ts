import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { IApartmentService } from "../services/interfaces/iapartment.service";
import { Route, Get, Post, Tags, Body, Controller, Put, Delete, Path, Security, Request, Query } from "tsoa";
import { CreateApartmentDTO, UpdateApartmentDTO } from "../entities/apartment.entity";
import { GeneralResponse } from "../business_objects/general.response";
import { SuccessCode } from "../utils/enums/enums";
import { validate } from "../utils/password/validate";
import { PaginationParameter } from "../business_objects/pagination";

@Route("apartments")
@Tags("Apartment Management")
@controller("apartments")
// (Lưu ý: Chúng ta sẽ bảo mật từng route, vì route 'GET' có thể là public)
export class ApartmentController extends Controller {
    
    constructor(@inject("IApartmentService") private readonly apartmentService: IApartmentService) {
        super(); 
    }

    /**
     * Tạo Căn hộ (Apartment) mới
     */
    @Post("/")
    @httpPost("/")
    @Security("jwt", ["ADMIN"]) // Chỉ Admin được tạo
    public async createApartment(@Body() dto: CreateApartmentDTO, @Request() req: any): Promise<GeneralResponse> {
        await validate(CreateApartmentDTO, dto);
        const currentUser = req.user.username;
        const newApartment = await this.apartmentService.createApartment(dto, currentUser);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, newApartment);
    }

    /**
     * Cập nhật Căn hộ
     */
    @Put("/{apartmentId}")
    @httpPut("/:apartmentId")
    @Security("jwt", ["ADMIN"]) // Chỉ Admin được sửa
    public async updateApartment(@Path() apartmentId: string, @Body() dto: UpdateApartmentDTO, @Request() req: any): Promise<GeneralResponse> {
        await validate(UpdateApartmentDTO, dto);
        const currentUser = req.user.username;
        const updatedApartment = await this.apartmentService.updateApartment(apartmentId, dto, currentUser);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, updatedApartment);
    }

    /**
     * Xóa mềm Căn hộ
     */
    @Delete("/{apartmentId}")
    @httpDelete("/:apartmentId")
    @Security("jwt", ["ADMIN"]) // Chỉ Admin được xóa
    public async deleteApartment(@Path() apartmentId: string, @Request() req: any): Promise<GeneralResponse> {
        const currentUser = req.user.username;
        const deletedApartment = await this.apartmentService.deleteApartment(apartmentId, currentUser);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, deletedApartment);
    }

    /**
     * Lấy Căn hộ bằng ID (Public)
     */
    @Get("/{apartmentId}")
    @httpGet("/:apartmentId")
    // (Không có @Security - Endpoint này là public)
    public async getApartmentById(@Path() apartmentId: string): Promise<GeneralResponse> {
        const apartment = await this.apartmentService.getApartmentById(apartmentId);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, apartment);
    }

    /**
     * Lấy tất cả Căn hộ (Public)
     */
    @Get("/")
    @httpGet("/")
    // (Không có @Security - Endpoint này là public)
    public async getAllApartments(
        @Query() pageIndex?: number, 
        @Query() pageSize?: number
    ): Promise<GeneralResponse> {
        const para = new PaginationParameter(pageIndex, pageSize);
        const apartments = await this.apartmentService.getAllApartments(para);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, apartments);
    }

    /**
     * Lấy tất cả Căn hộ theo Tòa nhà (Public)
     */
    @Get("/by-building/{buildingId}")
    @httpGet("/by-building/:buildingId")
    // (Không có @Security - Endpoint này là public)
    public async getAllApartmentsByBuilding(
        @Path() buildingId: string, 
        @Query() pageIndex?: number, 
        @Query() pageSize?: number
    ): Promise<GeneralResponse> {
        const para = new PaginationParameter(pageIndex, pageSize);
        const apartments = await this.apartmentService.getAllApartmentsByBuilding(buildingId, para);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS, apartments);
    }
}