import {
    Injectable,
    NotAcceptableException,
    NotFoundException,
} from "@nestjs/common";
import { User } from "src/app/entities/user.entity";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { Between, LessThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Appointment } from "src/app/entities/appointment.entity";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { AppointmentStatus } from "@/constants/values-constants";
import { MailerService } from "@/app/services/mailer/mailer.service";
import { MailConstants } from "@/constants/mail-constants";
import { UsersService } from "../users/users.service";
import { TimezoneDatesService } from "@/app/services/timezone-dates/timezone-dates.service";

@Injectable()
export class AppointmentsService {
    private readonly WORKNG_DAYS = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    private readonly WORKING_HOURS = {
        start: "09:00",
        end: "18:30",
    };
    private readonly APPOINTMENTS_LIMIT_PER_HOUR = 5;
    private readonly ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

    constructor(
        @InjectRepository(Appointment)
        private readonly repository: Repository<Appointment>,
        private readonly usersService: UsersService,
        private readonly mailerService: MailerService,
        private readonly tmzDatesService: TimezoneDatesService,
    ) {}

    async find(user: User): Promise<Appointment[]> {
        console.log(user);
        const userAppoinments = await user.appointments;

        console.log(userAppoinments);
        if (!userAppoinments.length) {
            throw new NotFoundException("No tienes citas programadas");
        }

        const sortedAppointments = userAppoinments.sort((a, b) => {
            return b.date.localeCompare(a.date);
        });

        return sortedAppointments;
    }

    async findAll(): Promise<Appointment[]> {
        const appointments = await this.repository.find();
        const haveFoundAppointments = appointments.length > 0;

        if (!haveFoundAppointments) {
            throw new NotFoundException("No hay citas programadas");
        }

        return appointments;
    }

    async findPendingAppointments(): Promise<Appointment[]> {
        const appointments = await this.repository.find({
            where: { status: AppointmentStatus.AppointmentsPending },
        });

        if (!appointments.length) {
            throw new NotFoundException("No hay citas pendientes");
        }
        return appointments;
    }

    async create(dto: CreateAppointmentDto, user: User): Promise<Appointment> {
        console.log(user);
        const customer = user;
        const message = "Ya tienes";
        const hasAppointment = await this.customerHasAppointmentsOnDate(
            customer,
            dto.date,
        );
        if (hasAppointment) {
            throw new NotAcceptableException(
                `${message} una cita programada para este día`,
            );
        }

        const isAvailable = await this.isAvailableAppointment(
            dto.date,
            dto.time,
        );

        if (!isAvailable) {
            throw new NotAcceptableException(
                "No hay citas disponibles para el horario seleccionado",
            );
        }

        const appointment = new Appointment({
            customer,
            status: AppointmentStatus.AppointmentsPending,
            ...dto,
        });
        this.validateAppointemt(appointment);

        const savedAppointment = await this.repository.save(appointment);
        if (this.isToday(dto.date)) {
            this.sendAppointmentNotification(savedAppointment);
        }

        return savedAppointment;
    }

    async update(
        id: number,
        dto: UpdateAppointmentDto,
        customer: User,
    ): Promise<Appointment> {
        let dateOrHourChanged = false;
        const appointment = await this.repository.findOneBy({ id });
        if (!appointment) {
            throw new NotAcceptableException("Cita no encontrada");
        }

        if (dto.userId && dto.userId !== appointment.customer.id) {
            appointment.customer = customer;
        } else {
            if (
                appointment.status ===
                    AppointmentStatus.AppointmentsCancelled ||
                appointment.status === AppointmentStatus.AppointmentsCompleted
            ) {
                const msg =
                    appointment.status ===
                    AppointmentStatus.AppointmentsCancelled
                        ? "cancelada"
                        : "completada";
                throw new NotAcceptableException(
                    `No puedes modificar esta cita porque ha sido ${msg}`,
                );
            }

            const now = this.tmzDatesService.getCurrentDate();
            const appointmentDate = this.tmzDatesService.convertToDate(
                appointment.date,
            );

            if (appointmentDate < now) {
                throw new NotAcceptableException(
                    "No puedes modificar una cita cuya fecha ya se venció",
                );
            }
        }

        if (dto.date !== appointment.date || dto.time !== appointment.time) {
            dateOrHourChanged = true;
        }

        if (dateOrHourChanged) {
            const isAvailable = await this.isAvailableAppointment(
                dto.date,
                dto.time,
            );

            if (!isAvailable) {
                throw new NotAcceptableException(
                    "No hay citas disponibles para el horario seleccionado",
                );
            }
        }

        const updatedAppointment = new Appointment({
            date: dto.date,
            time: dto.time,
            customer: customer,
        });
        this.validateAppointemt(updatedAppointment);

        const finalAppointment = this.repository.merge(appointment, dto);
        const savedAppointment = await this.repository.save(finalAppointment);

        if (dateOrHourChanged && this.isToday(dto.date)) {
            this.sendAppointmentNotification(savedAppointment);
        }

        return savedAppointment;
    }

    async cancel(id: number): Promise<Appointment> {
        const appointment = await this.repository.findOneBy({ id });
        if (!appointment) {
            throw new NotAcceptableException("Cita no encontrada");
        }

        if (
            appointment.status === AppointmentStatus.AppointmentsCancelled ||
            appointment.status === AppointmentStatus.AppointmentsCompleted
        ) {
            const msg =
                appointment.status === AppointmentStatus.AppointmentsCancelled
                    ? "cancelada"
                    : "completada";
            throw new NotAcceptableException(
                `No puedes cancelar esta cita porque ya ha sido ${msg}`,
            );
        }

        appointment.status = AppointmentStatus.AppointmentsCancelled;
        return await this.repository.save(appointment);
    }

    async getAppointmentsForToday() {
        const currentDate = this.tmzDatesService.getCurrentDate();
        const today = this.tmzDatesService.formatDateToString(currentDate);

        const appointments = await this.repository.find({
            where: { date: today },
        });

        return appointments;
    }

    async sendAppointmentNotification(appointment: Appointment) {
        const formattedDate = this.tmzDatesService.formatStringToDateString(
            appointment.date,
        );
        await this.mailerService.addMailJob(
            appointment.customer.email,
            MailConstants.SubjectAppointmentForTodayMail,
            "appointment-for-today",
            {
                name: appointment.customer.name,
                date: formattedDate,
                time: appointment.time,
            },
        );
    }

    async updatePendingAppointments() {
        const now = this.tmzDatesService.getCurrentDate();
        const thresholdDate = this.tmzDatesService.subtractTimeToDate(
            now,
            0,
            0,
            0,
            this.ONE_WEEK,
        );
        const formattedThresholdDate =
            this.tmzDatesService.formatDateToString(thresholdDate);

        const appointments = await this.repository.find({
            where: {
                status: AppointmentStatus.AppointmentsPending,
                date: LessThan(formattedThresholdDate),
            },
        });

        if (appointments.length > 0) {
            appointments.forEach(async (appointment) => {
                appointment.status = AppointmentStatus.AppointmentsCancelled;
                await this.repository.save(appointment);
            });
        }
    }

    async getPendingAppointmentsByUser(userId: number): Promise<string[]> {
        const user = await this.usersService.find(userId);

        if (!user) {
            throw new NotFoundException("Usuario no encontrado");
        }

        const appointments = await this.repository.find({
            where: {
                customer: user,
                status: AppointmentStatus.AppointmentsPending,
            },
            select: ["date"],
        });

        return appointments.map((appointment) => appointment.date);
    }

    async getUnavailableHours(date: string): Promise<string[]> {
        const intervals = this.getTimeIntervals("09:00", "18:30", 30);
        const unavailableHours = [];

        for (const time of intervals) {
            const appointments = await this.repository.find({
                where: {
                    date,
                    time: `${time}:00`,
                    status: AppointmentStatus.AppointmentsPending,
                },
            });

            if (appointments.length >= this.APPOINTMENTS_LIMIT_PER_HOUR) {
                unavailableHours.push(time);
            }
        }

        return unavailableHours;
    }

    private validateAppointemt(appointment: Appointment) {
        if (!this.isValidDay(appointment.date)) {
            throw new NotAcceptableException(
                "El día seleccionado no es válido, las citas solo se pueden agendar de lunes a sábado",
            );
        }

        if (!this.inWorkingHours(appointment.time)) {
            throw new NotAcceptableException(
                `El horario seleccionado no es válido, las citas solo se pueden agendar de ${this.WORKING_HOURS.start} a ${this.WORKING_HOURS.end}`,
            );
        }

        this.validateAppointmentDate(appointment.date, appointment.time);
    }

    private isValidDay(date: string): boolean {
        const dateObj = this.tmzDatesService.convertToDate(date);
        const dayOfWeek = this.tmzDatesService.getDayOfWeek(dateObj);

        return this.WORKNG_DAYS.includes(dayOfWeek);
    }

    private inWorkingHours(time: string): boolean {
        const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timePattern.test(time)) {
            throw new NotAcceptableException(
                "El formato de la hora es inválido, utilizar el formato HH:mm",
            );
        }

        return (
            time >= this.WORKING_HOURS.start && time <= this.WORKING_HOURS.end
        );
    }

    private validateAppointmentDate(date: string, time: string): void {
        const currentDate = this.tmzDatesService.getCurrentDate();
        const selectedDate = this.tmzDatesService.convertToDate(date);
        const normalizedCurrentDate =
            this.tmzDatesService.formatDateToString(currentDate);
        const normalizedSelectedDate =
            this.tmzDatesService.formatDateToString(selectedDate);

        if (normalizedSelectedDate < normalizedCurrentDate) {
            throw new NotAcceptableException(
                "No es posible programar una cita para una fecha anterior a la actual",
            );
        }

        const maxDate = this.tmzDatesService.addDaysToDate(currentDate, 60);
        if (selectedDate > maxDate) {
            throw new NotAcceptableException(
                "No es posible programar una cita para una fecha mayor a 60 días a partir de la fecha actual",
            );
        }

        if (this.tmzDatesService.isSameDay(selectedDate, currentDate)) {
            const [hours, minutes] = time.split(":").map(Number);
            const selectedDatetime = this.tmzDatesService.setTimeToDate(
                selectedDate,
                hours,
                minutes,
            );
            const currentTimePlusOneHour = this.tmzDatesService.addRangeToDate(
                currentDate,
                1,
                0,
            );

            if (selectedDatetime < currentTimePlusOneHour) {
                throw new NotAcceptableException(
                    "La hora de la cita debe ser al menos una hora mayor a la hora actual",
                );
            }
        }
    }

    private async isAvailableAppointment(
        date: string,
        time: string,
    ): Promise<boolean> {
        const formattedTime = `${time}:00`;

        const appointments = await this.repository.find({
            where: {
                date,
                time: formattedTime,
                status: AppointmentStatus.AppointmentsPending,
            },
        });

        return appointments.length < this.APPOINTMENTS_LIMIT_PER_HOUR;
    }

    private async customerHasAppointmentsOnDate(
        user: User,
        date: string,
    ): Promise<boolean> {
        const appointments = await this.repository.find({
            where: {
                customer: user,
                date,
                status: AppointmentStatus.AppointmentsPending,
            },
        });

        return appointments.length > 0;
    }

    private isToday(date: string): boolean {
        const today = this.tmzDatesService.getCurrentDate();
        const appointmentDate = this.tmzDatesService.convertToDate(date);

        return this.tmzDatesService.isSameDay(today, appointmentDate);
    }

    private getTimeIntervals(start: string, end: string, interval: number) {
        const times = [];
        let currentTime = this.tmzDatesService.createDateFromDatetime(
            `1970-01-01T${start}:00`,
        );
        const endTime = this.tmzDatesService.createDateFromDatetime(
            `1970-01-01T${end}:00`,
        );

        while (currentTime <= endTime) {
            const time = this.tmzDatesService.getCurrentTimeString(currentTime);
            times.push(time.substring(0, 5));
            currentTime = this.tmzDatesService.addRangeToDate(
                currentTime,
                0,
                interval,
            );
        }
        return times;
    }
}
