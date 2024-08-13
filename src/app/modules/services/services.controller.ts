import { Controller, Get, HttpCode } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ServicesService } from "./services.service";
import { ApiResponse } from "src/app/interfaces/api-response.interface";
import { Service } from "src/app/entities/service.entity";

@Controller("services")
@ApiTags("services")
@ApiBearerAuth()
export class ServicesController {
    constructor(
        private readonly service: ServicesService
    ) { }

    @Get()
    @HttpCode(200)
    async getServices(): Promise<ApiResponse<Service[]>> {
        const services = await this.service.findAll();
        return {
            status: 200,
            message: null,
            data: services
        };
    }
 }