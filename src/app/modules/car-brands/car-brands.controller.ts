import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import { CarBrandsService } from "./car-brands.service";
import { SignedUrlService } from "src/app/services/signed-url/signed-url.service";
import { CarBrand } from "src/app/entities/car-brand.entity";
import { CreateCarBrandDto } from "./dto/car-brand.dto";

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
    async getCarBrand(id: number) {
        return this.carBrandsService.findOne(id);
    }

    @Post()
    async createCarBrand(@Body() createCarBrandDto: CreateCarBrandDto) {
        const name = createCarBrandDto.name;
        return this.carBrandsService.create(new CarBrand(name));
    }


    @Put(":id")
    async 

}
