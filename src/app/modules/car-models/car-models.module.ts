import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarModel } from "src/app/entities/car-model.entity";
import { CarModelsService } from "./car-models.service";
import { CarModelsController } from "./car-models.controller";
import { CarBrand } from "src/app/entities/car-brand.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([CarModel, CarBrand]),
    ],
    controllers: [CarModelsController],
    providers: [CarModelsService]
})
export class CarModelsModule { }