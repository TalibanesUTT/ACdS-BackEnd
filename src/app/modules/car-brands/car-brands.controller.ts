import { Body, Controller, Get, Param, Post, Put, HttpCode } from "@nestjs/common";
import { CarBrandsService } from "./car-brands.service";
import { CarBrand } from "src/app/entities/car-brand.entity";
import { CreateCarBrandDto, UpdateCarBrandDto } from "./dto/car-brand.dto";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "src/app/interfaces/api-response.interface";
import { Roles } from "src/config/roles.decorator";
import { RoleEnum } from "src/app/entities/role.entity";

@Controller("car-brands")
export class CarBrandsController {
    constructor(
        private readonly carBrandsService: CarBrandsService,
    ) {}

    @Get()
    @HttpCode(200)
    @ApiTags("car-brands")
    @Roles(RoleEnum.ADMIN, RoleEnum.ROOT)
    async getCarBrands(): Promise<ApiResponse<CarBrand[]>> {
        const brands = await this.carBrandsService.findAll();
        return {
            status: 200,
            message: null,
            data: brands,
        }
    }

    @Get(":id")
    @HttpCode(200)
    @ApiParam({
        name: "id",
        type: "number",
        description: "The id of the car brand",
    })
    @ApiTags("car-brands")
    async getCarBrand(@Param() id: number): Promise<ApiResponse<CarBrand>> {
        const brand = await this.carBrandsService.findOne(id);
        return {
            status: 200,
            message: null,
            data: brand,
        }
    }

    @Post()
    @HttpCode(201)
    @ApiTags("car-brands")
    @Roles(RoleEnum.ADMIN, RoleEnum.ROOT)
    async createCarBrand(@Body() createCarBrandDto: CreateCarBrandDto): Promise<ApiResponse<CarBrand>> {
        const name = createCarBrandDto.name;
        const brand = await this.carBrandsService.create(new CarBrand(name));

        return {
            status: 201,
            message: "Marca de auto creada correctamente",
            data: brand
        }
    }

    @Put(":id")
    @HttpCode(200)
    @ApiTags("car-brands")
    @Roles(RoleEnum.ADMIN, RoleEnum.ROOT)
    async updateCarBrand(
        @Body() dto: UpdateCarBrandDto,
        @Param("id") id: number,
    ): Promise<ApiResponse<CarBrand>> {
        const name = dto.name;
        const brand = await this.carBrandsService.update(id, new CarBrand(name));

        return {
            status: 200,
            message: "Marca de auto actualizada correctamente",
            data: brand
        }
    }
}
