import { Controller, Get, HttpCode, Param, ParseIntPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { CarModelsService } from "./car-models.service";
import { Roles } from "src/config/roles.decorator";
import { RoleEnum } from "src/app/entities/role.entity";
import { ApiResponse } from "src/app/interfaces/api-response.interface";
import { CarModel } from "src/app/entities/car-model.entity";

@Controller("car-models")
@ApiTags("car-models")
@ApiBearerAuth()
export class CarModelsController { 
    constructor(
        private readonly carModelsService: CarModelsService
    ) { }

    @Get(":brandId")
    @HttpCode(200)
    @ApiParam({ name: "brandId", type: "number", description: "The id of the brand" })
    @Roles(RoleEnum.ADMIN, RoleEnum.ROOT)
    async getCarModels(@Param("brandId", ParseIntPipe) id: number): Promise<ApiResponse<CarModel[]>> {
        const models = await this.carModelsService.findByBrand(id);
        return { 
            status: 200,
            message: null,
            data: models
         };
    }
}