import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { CarBrandsService } from "./car-brands.service";
import { SignedUrlService } from "src/app/services/signed-url/signed-url.service";
import { CarBrand } from "src/app/entities/car-brand.entity";
import { CreateCarBrandDto, UpdateCarBrandDto } from "./dto/car-brand.dto";
import { ApiParam } from "@nestjs/swagger";

@Controller("car-brands")
export class CarBrandsController {
    constructor(
        private readonly signedURLService: SignedUrlService,
        private readonly carBrandsService: CarBrandsService,
    ) {}

    @Get()
    async getCarBrands() {
        return this.carBrandsService.findAll().then((carBrands) =>
            carBrands.map((carBrand) => ({
                name: carBrand.name,
                updateURL: this.signedURLService.signExistingUrl(
                    `car-brands/${carBrand.id}`,
                    {
                        sub: carBrand.id,
                    },
                ),
            })),
        );
    }

    @Get(":id")
    @ApiParam({
        name: "id",
        type: "number",
        description: "The id of the car brand",
    })
    async getCarBrand(@Param() id: number) {
        return this.carBrandsService.findOne(id);
    }

    @Post()
    async createCarBrand(@Body() createCarBrandDto: CreateCarBrandDto) {
        const name = createCarBrandDto.name;
        return this.carBrandsService.create(new CarBrand(name));
    }

    @Put(":id")
    async updateCarBrand(
        @Body() dto: UpdateCarBrandDto,
        @Param("id") id: number,
    ) {
        const name = dto.name;
        return this.carBrandsService.update(id, new CarBrand(name));
    }
}
