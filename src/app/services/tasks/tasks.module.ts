import { Module } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { AppointmentsModule } from "@/app/modules/appointments/appointments.module";

@Module({
    imports: [
        AppointmentsModule,
    ],
    providers: [TasksService]
})
export class TasksModule {}