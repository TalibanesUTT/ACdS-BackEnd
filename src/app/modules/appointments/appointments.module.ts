import { Module } from "@nestjs/common";
import { AppointmentsController } from "./appointments.controller";
import { AppointmentsService } from "./appointments.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Appointment } from "@/app/entities/appointment.entity";
import { User } from "src/app/entities/user.entity";
import { MailerModule } from "@/app/services/mailer/mailer.module";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Appointment, User]),
        MailerModule,
        UsersModule,
    ],
    controllers: [AppointmentsController],
    providers: [AppointmentsService],
    exports: [AppointmentsService],
})
export class AppointmentsModule {}
