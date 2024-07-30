import { Injectable, NotAcceptableException } from "@nestjs/common";
import { User } from "src/app/entities/user.entity";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Appointment } from "src/app/entities/appointment.entity";

@Injectable()
export class AppointmentsService {
    private readonly APPOINTMENTS_LIMIT_PER_HOUR = 5;
    constructor(
        @InjectRepository(Appointment)
        private readonly repository: Repository<Appointment>,
    ) {}

    async find(user: User) {
        return await user.appointments;
    }

    async findAll() {
        return this.repository.find();
    }

    async create(dto: CreateAppointmentDto, user: User) {
        const hasAppointment = await user.hasAppointmentsOnDate(dto.date);
        if (hasAppointment) {
            throw new NotAcceptableException(
                "Ya tienes una cita programada para este día",
            );
        }

        const isAvailable = await this.isAvailableAppointment(
            dto.date,
            dto.time,
        );

        if (!isAvailable) {
            throw new NotAcceptableException(
                "Ya no hay horarios disponibles para esta hora",
            );
        }

        const appointment = new Appointment({ customer: user, ...dto });
        appointment.validate();

        return this.repository.save(appointment);
    }

    private async isAvailableAppointment(date: Date, time: string) {
        const appointments = await this.repository.find({
            where: { date, time },
        });
        return appointments.length < this.APPOINTMENTS_LIMIT_PER_HOUR;
    }
}
