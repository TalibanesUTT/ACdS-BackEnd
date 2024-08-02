import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { GetUser } from "src/config/user.decorator";
import { User } from "src/app/entities/user.entity";
import { ApiResponse } from "@/app/interfaces/api-response.interface";
import { Appointment } from "@/app/entities/appointment.entity";
import { UpdateAppointmentDto } from "./dto/update-appointment.dtop";

@ApiTags("Appointments")
@Controller("appointments")
export class AppointmentsController {
    constructor(private readonly service: AppointmentsService) {}

    @ApiBearerAuth()
    @Get()
    async find(@GetUser() user: User): Promise<ApiResponse<Appointment[]>> {
        const userAppointments = await this.service.find(user);

        return {
            message: "Citas encontradas",
            data: userAppointments,
            status: HttpStatus.OK,
        };
    }

    @ApiBearerAuth()
    @Get("all")
    async findAll(): Promise<ApiResponse<Appointment[]>> {
        const appointments = await this.service.findAll();
        return {
            message: "Citas encontradas",
            data: appointments,
            status: HttpStatus.OK,
        };
    }

    @ApiBearerAuth()
    @Post()
    async create(
        @Body() dto: CreateAppointmentDto,
        @GetUser() user: User,
    ): Promise<ApiResponse<Appointment>> {
        const newAppoinment = await this.service.create(dto, user);
        return {
            message: "Cita creada",
            data: newAppoinment,
            status: HttpStatus.CREATED,
        };
    }

    @ApiBearerAuth()
    @ApiParam({ name: "id", type: Number, description: "Id de la cita" })
    @Post(":id")
    async update(
        @Body() dto: UpdateAppointmentDto,
        @Param("id") id: number,
    ): Promise<ApiResponse<Appointment>> {
        const updatedAppoinment = await this.service.update(id, dto);

        return {
            message: "Cita actualizada",
            data: updatedAppoinment,
            status: HttpStatus.OK,
        };
    }
}
