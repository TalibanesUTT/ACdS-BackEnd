import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { ExpendituresService } from "./expenditures.service";
import { Roles } from "@/config/roles.decorator";
import { RoleEnum } from "@/app/entities/role.entity";
import { ExpenditureDto } from "./dto/expenditure.dto";
import { ApiResponse } from "@/app/interfaces/api-response.interface";
import { Expenditure } from "@/app/entities/expenditure.entity";

@Controller("expenditures")
@ApiTags("expenditures")
@ApiBearerAuth()
export class ExpendituresController {
    constructor(
        private readonly expendituresService: ExpendituresService
    ) {}

    @Get(":month/:year")
    @HttpCode(200)
    @Roles(RoleEnum.ADMIN, RoleEnum.ROOT)
    @ApiParam({ name: "month", type: "number", description: "The month of the expenditure" })
    @ApiParam({ name: "year", type: "number", description: "The year of the expenditure" })
    async getExpenditure(
        @Param("month", ParseIntPipe) month: number,
        @Param("year", ParseIntPipe) year: number
    ): Promise<ApiResponse<Expenditure>> {
        const expenditure = await this.expendituresService.findOne(year, month);
        return {
            status: 200,
            message: null,
            data: expenditure,
        }
    }

    @Post()
    @HttpCode(200)
    @Roles(RoleEnum.ADMIN, RoleEnum.ROOT)
    async createExpenditure(@Body() dto: ExpenditureDto): Promise<ApiResponse<Expenditure>> {
        const expenditure = await this.expendituresService.create(dto);
        return {
            status: 200,
            message: "Egresos registrados correctamente",
            data: expenditure,
        }
    }
}