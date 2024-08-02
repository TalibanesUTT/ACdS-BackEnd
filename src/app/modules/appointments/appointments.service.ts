import {
    Injectable,
    NotAcceptableException,
    NotFoundException,
} from "@nestjs/common";
import { User } from "src/app/entities/user.entity";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Appointment } from "src/app/entities/appointment.entity";
import { UpdateAppointmentDto } from "./dto/update-appointment.dtop";

@Injectable()
export class AppointmentsService {
    private readonly APPOINTMENTS_LIMIT_PER_HOUR = 5;
    constructor(
        @InjectRepository(Appointment)
        private readonly repository: Repository<Appointment>,
    ) {}

    async find(user: User) {
        const userAppoinments = await user.appointments;
        const hasAppoinments = userAppoinments.length > 0;

        if (!hasAppoinments) {
            throw new NotFoundException("No tienes citas programadas");
        }

        return userAppoinments;
    }

    async findAll() {
        const appointments = await this.repository.find();
        const haveFoundAppointments = appointments.length > 0;

        if (!haveFoundAppointments) {
            throw new NotFoundException("No hay citas programadas");
        }

        return appointments;
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

    async update(id: number, dto: UpdateAppointmentDto) {
        console.log(id);
        const appointment = await this.repository.findOneBy({ id });
        if (!appointment) {
            throw new NotAcceptableException("Cita no encontrada");
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

        const updatedAppointment = new Appointment({ ...dto });
        updatedAppointment.validate();

        const finalAppointment = this.repository.merge(appointment, dto);

        return this.repository.save(finalAppointment);
    }

    private async isAvailableAppointment(date: Date, time: string) {
        const appointments = await this.repository.find({
            where: { date, time },
        });
        return appointments.length < this.APPOINTMENTS_LIMIT_PER_HOUR;
    }
}
