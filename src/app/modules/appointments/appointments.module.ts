import { Module } from "@nestjs/common";
import { AppointmentsController } from "./appointments.controller";
import { AppointmentsService } from "./appointments.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Appointment } from "@/app/entities/appointment.entity";
import { User } from "src/app/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Appointment, User])],
    controllers: [AppointmentsController],
    providers: [AppointmentsService],
})
export class AppointmentsModule {}
