import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { ServiceOrdersService } from "./service-orders.service";
import { Roles } from "@/config/roles.decorator";
import { RoleEnum } from "@/app/entities/role.entity";
import { CreateServiceOrderDto, UpdateServiceOrderDto } from "./dto/service-order.dto";
import { ApiResponse } from "@/app/interfaces/api-response.interface";
import { ServiceOrder } from "@/app/entities/service-order.entity";
import { CreateServiceOrderDetailDto } from "./dto/service-order-detail.dto";
import { GetUser } from "@/config/user.decorator";
import { User } from "@/app/entities/user.entity";
import { StatusDto } from "./dto/status.dto";

@Controller("service-orders")
@ApiTags("service-orders")
@ApiBearerAuth()
export class ServiceOrdersController {
    constructor(
        private readonly serviceOrdersService: ServiceOrdersService
    ) {}

    @Get()
    @HttpCode(200)
    @Roles(RoleEnum.ADMIN, RoleEnum.ROOT)
    async getServiceOrders(): Promise<ApiResponse<ServiceOrder[]>> {
        const orders = await this.serviceOrdersService.findAll();
        return {
            status: 200,
            message: null,
            data: orders,
        }
    }

    @Get(":id")
    @HttpCode(200)
    @ApiParam({ name: "id", type: "number", description: "The id of the service order" })
    async getServiceOrder(@Param("id", ParseIntPipe) id: number): Promise<ApiResponse<ServiceOrder>> {
        const order = await this.serviceOrdersService.findOne(id);
        return {
            status: 200,
            message: null,
            data: order,
        }
    }

    @Get("user/:userId")
    @HttpCode(200)
    @ApiParam({ name: "userId", type: "number", description: "The id of the user" })
    async getServiceOrdersByUser(@Param("userId", ParseIntPipe) userId: number): Promise<ApiResponse<ServiceOrder[]>> {
        const orders = await this.serviceOrdersService.findByUser(userId);
        return {
            status: 200,
            message: null,
            data: orders,
        }
    }

    @Post()
    @HttpCode(201)
    @Roles(RoleEnum.ADMIN, RoleEnum.ROOT)
    async createServiceOrder(
        @Body() dto: CreateServiceOrderDto,
        @GetUser() user: User
    ): Promise<ApiResponse<ServiceOrder>> {
        const serviceOrder = await this.serviceOrdersService.create(dto, user);
        return {
            status: 201,
            message: "Orden de servicio creada exitosamente",
            data: serviceOrder,
        }
    }

    @Put(":id")
    @HttpCode(200)
    @Roles(RoleEnum.ADMIN, RoleEnum.ROOT)
    @ApiParam({ name: "id", type: "number", description: "The id of the service order" })
    async updateServiceOrder(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: UpdateServiceOrderDto
    ): Promise<ApiResponse<ServiceOrder>> {
        const serviceOrder = await this.serviceOrdersService.update(id, dto);
        return {
            status: 200,
            message: "Orden de servicio actualizada exitosamente",
            data: serviceOrder,
        }
    }

    @Post("addDetail/:id")
    @HttpCode(201)
    @Roles(RoleEnum.ADMIN, RoleEnum.ROOT)
    @ApiParam({ name: "id", type: "number", description: "The id of the service order" })
    async addServiceOrderDetail(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: CreateServiceOrderDetailDto
    ): Promise<ApiResponse<ServiceOrder>> {
        const serviceOrder = await this.serviceOrdersService.addDetail(id, dto);
        return {
            status: 201,
            message: "Detalle de orden de servicio asignado exitosamente",
            data: serviceOrder,
        }
    }

    @Post("updateStatus/:id")
    @HttpCode(200)
    @Roles(RoleEnum.ADMIN, RoleEnum.ROOT, RoleEnum.MECHANIC)
    @ApiParam({ name: "id", type: "number", description: "The id of the service order" })
    async updateServiceOrderStatus(
        @Param("id", ParseIntPipe) id: number,
        @GetUser() user: User,
        @Body() dto: StatusDto,
    ): Promise<ApiResponse<ServiceOrder>> {
        const serviceOrder = await this.serviceOrdersService.updateStatus(id, user, dto);
        return {
            status: 200,
            message: "Estatus de orden de servicio actualizado exitosamente",
            data: serviceOrder,
        }
    }
}