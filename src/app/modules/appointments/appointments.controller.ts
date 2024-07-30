import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { GetUser } from "src/config/user.decorator";
import { User } from "src/app/entities/user.entity";
import { ApiResponse } from "@/app/interfaces/api-response.interface";
import { Appointment } from "@/app/entities/appointment.entity";

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
    async findAll() {
        return this.service.findAll();
    }

    @ApiBearerAuth()
    @Post()
    async create(@Body() dto: CreateAppointmentDto, @GetUser() user: User) {
        return this.service.create(dto, user);
    }

    @ApiBearerAuth()
    @ApiParam({ name: "id", type: Number, description: "Id de la cita" })
    @Post(":id")
    async update(@Body() dto: CreateAppointmentDto, @Param("id") id: number) {
        return this.service.update(id, dto);
    }
}
