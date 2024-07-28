import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarBrand } from "src/app/entities/car-brand.entity";
import { CarModel } from "src/app/entities/car-model.entity";
import { Vehicle } from "src/app/entities/vehicle.entity";
import { UsersModule } from "../users/users.module";
import { VehiclesController } from "./vehicles.controller";
import { VehiclesService } from "./vehicles.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Vehicle, CarBrand, CarModel]),
        UsersModule
    ],
    controllers: [VehiclesController],
    providers: [VehiclesService]
})
export class VehiclesModule { }