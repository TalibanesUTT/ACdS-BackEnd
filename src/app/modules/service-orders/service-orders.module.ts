import { Appointment } from "@/app/entities/appointment.entity";
import { ServiceOrder } from "@/app/entities/service-order.entity";
import { Service } from "@/app/entities/service.entity";
import { Vehicle } from "@/app/entities/vehicle.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServiceOrdersController } from "./service-orders.controller";
import { ServiceOrdersService } from "./service-orders.service";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [
        UsersModule,
        TypeOrmModule.forFeature([ServiceOrder, Vehicle, Appointment, Service])
    ],
    controllers: [ServiceOrdersController],
    providers: [ServiceOrdersService],
})
export class ServiceOrdersModule {}