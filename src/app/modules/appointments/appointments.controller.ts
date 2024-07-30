import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { GetUser } from "src/config/user.decorator";
import { User } from "src/app/entities/user.entity";

@ApiTags("Appointments")
@Controller("appointments")
export class AppointmentsController {
    constructor(private readonly service: AppointmentsService) {}

    @ApiBearerAuth()
    @Get()
    async find(@GetUser() user: User) {
        return this.service.find(user);
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
}
