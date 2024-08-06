import { AppointmentsService } from "@/app/modules/appointments/appointments.service";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { MailerService } from "../mailer/mailer.service";
import { MailConstants } from "@/constants/mail-constants";

@Injectable()
export class TasksService {
    constructor(
        private readonly appointmentsService: AppointmentsService,
    ) {}

    @Cron("0 8 * * 1-6")
    async notifyAppointments() {
        const appointments = await this.appointmentsService.getAppointmentsForToday();

        if (appointments.length === 0) {
            return;
        }

        await Promise.all(
            appointments.map(async appointment => {
                await this.appointmentsService.sendAppointmentNotification(appointment);
            })
        );
    }
    
    @Cron("0 0 * * 0")
    async updateExpiredAppointments() {
        await this.appointmentsService.updatePendingAppointments();
    } 
}