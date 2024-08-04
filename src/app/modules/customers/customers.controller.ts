import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/config/roles.decorator";
import { RoleEnum } from "src/app/entities/role.entity";
import { ApiResponse } from "src/app/interfaces/api-response.interface";
import { User } from "src/app/entities/user.entity";
import { CustomerDto } from "./dto/customer.dto";
import { UpdateUserDto } from "../user-management/dto/update-user.dto";

@Controller("customers")
@ApiTags("customers")
@ApiBearerAuth()
export class CustomersController {
    constructor(
        private readonly service: CustomersService,
    ) {}

    @Get()
    @HttpCode(200)
    @Roles(RoleEnum.ADMIN, RoleEnum.ROOT)
    async getCustomers(): Promise<ApiResponse<User[]>> {
        const customers = await this.service.findAll();
        return {
            status: 200,
            message: null,
            data: customers,
        }
    }

    @Get(":id")
    @HttpCode(200)
    @ApiParam({
        name: "id",
        type: "number",
        description: "The id of the customer",
    })
    async getCustomer(@Param("id", ParseIntPipe) id: number): Promise<ApiResponse<User>> {
        const customer = await this.service.findOne(id);
        return {
            status: 200,
            message: null,
            data: customer,
        }
    }

    @Post()
    @HttpCode(201)
    @Roles(RoleEnum.ADMIN, RoleEnum.ROOT)
    async createCustomer(@Body() dto: CustomerDto): Promise<ApiResponse<User>> {
        return await this.service.create(dto);
    }

    @Put(":id")
    @HttpCode(200)
    @Roles(RoleEnum.ADMIN, RoleEnum.ROOT)
    async updateCustomer(
        @Param("id", ParseIntPipe) id: number, 
        @Body() dto: UpdateUserDto,
    ): Promise<ApiResponse<User>> {
        return await this.service.update(id, dto);
    }
}