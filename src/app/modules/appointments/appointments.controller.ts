import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { GetUser } from "src/config/user.decorator";
import { User } from "src/app/entities/user.entity";
import { ApiResponse } from "@/app/interfaces/api-response.interface";
import { Appointment } from "@/app/entities/appointment.entity";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";

@ApiTags("Appointments")
@Controller("appointments")
@ApiBearerAuth()
export class AppointmentsController {
    constructor(private readonly service: AppointmentsService) {}

    @Get()
    @HttpCode(200)
    async find(@GetUser() user: User): Promise<ApiResponse<Appointment[]>> {
        const userAppointments = await this.service.find(user);

        return {
            message: null,
            data: userAppointments,
            status: HttpStatus.OK,
        };
    }

    @Get("all")
    @HttpCode(200)
    async findAll(): Promise<ApiResponse<Appointment[]>> {
        const appointments = await this.service.findAll();
        return {
            message: null,
            data: appointments,
            status: HttpStatus.OK,
        };
    }

    @Post()
    @HttpCode(201)
    async create(
        @Body() dto: CreateAppointmentDto,
        @GetUser() user: User,
    ): Promise<ApiResponse<Appointment>> {
        const newAppoinment = await this.service.create(dto, user);
        return {
            message: "Cita agendada correctamente",
            data: newAppoinment,
            status: HttpStatus.CREATED,
        };
    }

    @ApiParam({ name: "id", type: Number, description: "Id de la cita" })
    @Put(":id")
    @HttpCode(200)
    async update(
        @Body() dto: UpdateAppointmentDto,
        @Param("id") id: number,
    ): Promise<ApiResponse<Appointment>> {
        const updatedAppoinment = await this.service.update(id, dto);

        return {
            message: "Cita actualizada correctamente",
            data: updatedAppoinment,
            status: HttpStatus.OK,
        };
    }

    @ApiParam({ name: "id", type: Number, description: "Id de la cita" })
    @Put("cancel/:id")
    @HttpCode(200)
    async cancel(@Param("id", ParseIntPipe) id: number): Promise<ApiResponse<Appointment>> {
        const canceledAppoinment = await this.service.cancel(id);

        return {
            message: "Cita cancelada correctamente",
            data: canceledAppoinment,
            status: HttpStatus.OK,
        };
    }

    @ApiParam({ name: "id", type: Number, description: "Id del cliente" })
    @Get("appointmentsDates/:userId")
    @HttpCode(200)
    async getPendingAppointemntsByUser(@Param("userId", ParseIntPipe) userId: number): Promise<ApiResponse<Date[]>> {
        const dates = await this.service.getPendingAppointmentsByUser(userId);
        return {
            message: null,
            data: dates,
            status: HttpStatus.OK,
        };
    }

    @ApiParam({ name: "date", type: String, description: "Fecha de la cita (YYYY-MM-DD)" })
    @Get("unavailableHours/:date")
    @HttpCode(200)
    async getUnavailableHours(@Param("date") date: string): Promise<ApiResponse<string[]>> {
        const hours = await this.service.getUnavailableHours(new Date(date));
        return {
            message: null,
            data: hours,
            status: HttpStatus.OK,
        };
    }
}
