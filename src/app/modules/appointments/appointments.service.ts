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
import { format } from "date-fns";

@Injectable()
export class AppointmentsService {
    private readonly WORKNG_DAYS = [0, 1, 2, 3, 4, 5]; // Monday to Saturday
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
    ) {}

    async find(user: User): Promise<Appointment[]> {
        const userAppoinments = await user.appointments;
        const hasAppoinments = userAppoinments.length > 0;

        if (!hasAppoinments) {
            throw new NotFoundException("No tienes citas programadas");
        }

        return userAppoinments;
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
        return appointments
    }

    async create(dto: CreateAppointmentDto, user: User): Promise<Appointment> {
        let customer = user;
        let message = "Ya tienes";
        if (dto.userId) {
            message = "El usuario ya tiene";
            customer = await this.usersService.find(dto.userId);

            if (!customer) {
                throw new NotFoundException("Usuario no encontrado");
            }
        }
        
        const hasAppointment = await this.customerHasAppointmentsOnDate(customer, dto.date);
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
            throw new NotAcceptableException("No hay citas disponibles para el horario seleccionado");
        }

        const appointment = new Appointment({ 
            customer, 
            status: AppointmentStatus.AppointmentsPending,
            ...dto 
        });
        this.validateAppointemt(appointment);

        const savedAppointment = await this.repository.save(appointment);
        if (this.isToday(dto.date)) {
            this.sendAppointmentNotification(savedAppointment);
        }

        return savedAppointment;
    }

    async update(id: number, dto: UpdateAppointmentDto): Promise<Appointment> {
        var dateOrHourChanged = false;
        let message = "Ya tienes";
        const appointment = await this.repository.findOneBy({ id });
        if (!appointment) {
            throw new NotAcceptableException("Cita no encontrada");
        }

        if (dto.userId && dto.userId !== appointment.customer.id) {
            message = "El usuario ya tiene";
            const customer = await this.usersService.find(dto.userId);
            if (!customer) {
                throw new NotFoundException("Usuario no encontrado");
            }

            appointment.customer = customer;
        } else {
            if (appointment.status === AppointmentStatus.AppointmentsCancelled || appointment.status === AppointmentStatus.AppointmentsCompleted) {
                const msg = appointment.status === AppointmentStatus.AppointmentsCancelled ? "cancelada" : "completada";
                throw new NotAcceptableException(`No puedes modificar esta cita porque ha sido ${msg}`);	
            }

            const now = new Date();
            if (appointment.date < now) {
                throw new NotAcceptableException("No puedes modificar una cita cuya fecha ya se venció");
            }
        }

        if (dto.date !== appointment.date || dto.time !== appointment.time) {
            dateOrHourChanged = true;
        }

        if (dateOrHourChanged) {
            const hasAppointment = await this.customerHasAppointmentsOnDate(appointment.customer, dto.date);
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
                throw new NotAcceptableException("No hay citas disponibles para el horario seleccionado");
            }
    
        }

        const updatedAppointment = new Appointment({ ...dto });
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

        if (appointment.status === AppointmentStatus.AppointmentsCancelled || appointment.status === AppointmentStatus.AppointmentsCompleted) {
            const msg = appointment.status === AppointmentStatus.AppointmentsCancelled ? "cancelada" : "completada";
            throw new NotAcceptableException(`No puedes cancelar esta cita porque ya ha sido ${msg}`);	
        }

        appointment.status = AppointmentStatus.AppointmentsCancelled;
        return await this.repository.save(appointment);
    }

    async getAppointmentsForToday() {
        const startOfDay = new Date();
        const endOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        endOfDay.setHours(23, 59, 59, 999);

        const appointments = await this.repository.find({
            where: { date: Between(startOfDay, endOfDay) },
        });

        return appointments;
    }

    async sendAppointmentNotification(appointment: Appointment) {
        const formattedDate = format(appointment.date, "dd/MM/yyyy");
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
        const now = new Date();
        const thresholdDate = new Date(now.getTime() - this.ONE_WEEK);

        const appointments = await this.repository.find({
            where: { 
                status: AppointmentStatus.AppointmentsPending,
                date: LessThan(thresholdDate), 
            },
        });

        if (appointments.length > 0) {
            appointments.forEach(async appointment => {
                appointment.status = AppointmentStatus.AppointmentsCancelled;
                await this.repository.save(appointment);
            })
        }
    }

    async getPendingAppointmentsByUser(userId: number): Promise<Date[]> {
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

        return appointments.map(appointment => appointment.date);
    }

    async getUnavailableHours(date: Date): Promise<string[]> {
        const intervals = this.getTimeIntervals("09:00", "18:30", 30);
        const unavailableHours = [];

        for (const time of intervals) {
            const appointments = await this.repository.find({
                where: { 
                    date, 
                    time: time, 
                    status: AppointmentStatus.AppointmentsPending
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
            throw new NotAcceptableException("El día seleccionado no es válido, las citas solo se pueden agendar de lunes a sábado");
        }

        if (!this.inWorkingHours(appointment.time)) {
            throw new NotAcceptableException(
                `El horario seleccionado no es válido, las citas solo se pueden agendar de ${this.WORKING_HOURS.start} a ${this.WORKING_HOURS.end}`
            );
        }

        this.validateAppointmentDate(appointment.date, appointment.time);
    }

    private isValidDay(date: Date) {
        const dayOfWeek = date.getDay();
        return this.WORKNG_DAYS.includes(dayOfWeek);
    }

    private inWorkingHours(time: string): boolean {
        const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timePattern.test(time)) {
            throw new NotAcceptableException("El formato de la hora es inválido, utilizar el formato HH:mm");
        }

        return (
            time >= this.WORKING_HOURS.start && time <= this.WORKING_HOURS.end
        )
    }

    private validateAppointmentDate(date: Date, time: string): void {
        const currentDate = new Date();
        const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); 
        const selectedDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());  

        if (selectedDay < today) {
            throw new NotAcceptableException("No es posible programar una cita para una fecha anterior a la actual");
        }

        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 60);

        if (selectedDay > maxDate) {
            throw new NotAcceptableException("No es posible programar una cita para una fecha mayor a 60 días a partir de la fecha actual");
        }

        const [hours, minutes] = time.split(":").map(Number);
        const selectedDatetime = new Date(selectedDay.setHours(hours, minutes, 0, 0));    

        if (selectedDay.getTime() === today.getTime()) {
            const currentTimePlusOneHour = new Date();
            currentTimePlusOneHour.setHours(currentDate.getHours() + 1, 0, 0, 0);

            if (selectedDatetime < currentTimePlusOneHour) {
                throw new NotAcceptableException("La hora de la cita debe ser al menos una hora mayor a la hora actual");
            }
        }
    }

    private async isAvailableAppointment(date: Date, time: string): Promise<boolean> {
        const  formattedTime = `${time}:00`;
        
        const appointments = await this.repository.find({
            where: { 
                date, 
                time: formattedTime,
                status: AppointmentStatus.AppointmentsPending
            },
        });

        return appointments.length < this.APPOINTMENTS_LIMIT_PER_HOUR;
    }

    private async customerHasAppointmentsOnDate(user: User, date: Date): Promise<boolean> {
        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        endOfDay.setHours(23, 59, 59, 999);

        const appointments = await this.repository.find({
            where: { 
                customer: user,
                date: Between(startOfDay, endOfDay),
                status: AppointmentStatus.AppointmentsPending,  
            },
        });

        return appointments.length > 0;
    }

    private isToday(date: Date) {
        const today = new Date();
        const appointmentDate = new Date(date);
        today.setHours(0, 0, 0, 0);
        appointmentDate.setHours(0, 0, 0, 0);

        return today.getTime() === appointmentDate.getTime();
    }

    private getTimeIntervals(start: string, end: string, interval: number) {
        const times = [];
        let currentTime = new Date(`1970-01-01T${start}:00`);
        const endTime = new Date(`1970-01-01T${end}:00`);

        while (currentTime <= endTime) {
            times.push(currentTime.toTimeString().substring(0, 5));
            currentTime.setMinutes(currentTime.getMinutes() + interval);
        }
        return times;
    }
}
