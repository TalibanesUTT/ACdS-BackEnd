import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Service } from "src/app/entities/service.entity";
import { ServicesController } from "./services.controller";
import { ServicesService } from "./services.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Service])
    ],
    controllers: [ServicesController],
    providers: [ServicesService]
})
export class ServicesModule { }