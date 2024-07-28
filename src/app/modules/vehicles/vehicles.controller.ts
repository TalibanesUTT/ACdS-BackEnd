import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { VehiclesService } from "./vehicles.service";
import { Roles } from "src/config/roles.decorator";
import { RoleEnum } from "src/app/entities/role.entity";
import { CreateVehicleDto, UpdateVehicleDto } from "./dto/vehicle.dto";
import { ApiResponse } from "src/app/interfaces/api-response.interface";
import { Vehicle } from "src/app/entities/vehicle.entity";

@Controller("vehicles")
@ApiTags("vehicles")
export class VehiclesController { 
    constructor(
        private readonly vehiclesService: VehiclesService,
    ) { }

    @Get()
    @HttpCode(200)
    @Roles(RoleEnum.ADMIN, RoleEnum.ROOT)
    async getVehicles(): Promise<ApiResponse<Vehicle[]>> {
        const vehicles = await this.vehiclesService.findAll();
        return { 
            status: 200,
            message: null,
            data: vehicles
         };
    }

    @Get(":id")
    @HttpCode(200)
    @ApiParam({ name: "id", type: "number", description: "The id of te vehicle" })
    async getVehicle(@Param("id", ParseIntPipe) id: number): Promise<ApiResponse<Vehicle>> {
        const vehicle = await this.vehiclesService.findOne(id);
        return { 
            status: 200,
            message: null,
            data: vehicle
         };
    }

    @Get("my-vehicles/:ownerId")
    @HttpCode(200)
    @ApiParam({ name: "ownerId", type: "number", description: "The id of the owner" })
    async getVehiclesByOwner(@Param("ownerId", ParseIntPipe) ownerId: number): Promise<ApiResponse<Vehicle[]>> {
        const vehicles = await this.vehiclesService.findByOwner(ownerId);
        return { 
            status: 200,
            message: null,
            data: vehicles
         };
    }

    @Post()
    @HttpCode(201)
    @Roles(RoleEnum.ADMIN, RoleEnum.ROOT)
    async createVehicle(@Body() dto: CreateVehicleDto): Promise<ApiResponse<Vehicle>> {
        const vehicle = await this.vehiclesService.create(dto);
        return { 
            status: 201,
            message: "Vehículo creado correctamente",
            data: vehicle
         };
    }

    @Put(":id")
    @HttpCode(200)
    @Roles(RoleEnum.ADMIN, RoleEnum.ROOT)
    async updateVehicle(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: UpdateVehicleDto): Promise<ApiResponse<Vehicle>> {
        const vehicle = await this.vehiclesService.update(id, dto);
        return { 
            status: 200,
            message: "Vehículo actualizado correctamente",
            data: vehicle
        };
    }
}