import { Controller, Get, HttpCode, ParseIntPipe, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ReportsService } from "./reports.service";
import { Roles } from "@/config/roles.decorator";
import { RoleEnum } from "@/app/entities/role.entity";

@Controller("reports")
@ApiTags("reports")
@ApiBearerAuth()
@Roles(RoleEnum.ADMIN, RoleEnum.ROOT)
export class ReportsController {
    constructor(
        private readonly reportsService: ReportsService
    ){}

    @Get("accounting-balance")
    @HttpCode(200)
    @ApiQuery({ name: "year", type: "number", description: "The year of the accounting balance" })
    @ApiQuery({ name: "month", type: "number", description: "The month of the accounting balance", required: false })
    async getAccountingBalance(
        @Query("year", ParseIntPipe) year: number,
        @Query("month") month?: string
    ): Promise<any> {
        const parsedMonth = month !== undefined ? parseInt(month, 10) : null;
        return this.reportsService.getAccountingBalance(year, parsedMonth);
    }

    @Get("expenditure-summary")
    @HttpCode(200)
    @ApiQuery({ name: "year", type: "number", description: "The year of the expenditure summary" })
    @ApiQuery({ name: "month", type: "number", description: "The month of the expenditure summary", required: false })
    async getExpenditureSummary(
        @Query("year", ParseIntPipe) year: number,
        @Query("month") month?: string
    ): Promise<any> {
        const parsedMonth = month !== undefined ? parseInt(month, 10) : null;
        return this.reportsService.getExpenditureSummary(year, parsedMonth);
    }

    @Get("income-summary")
    @HttpCode(200)
    @ApiQuery({ name: "startDate", type: "string", description: "The start date of the income summary" })
    @ApiQuery({ name: "endDate", type: "string", description: "The end date of the income summary" })
    async getIncomeSummary(
        @Query("startDate") startDate: string,
        @Query("endDate") endDate: string
    ): Promise<any> {
        return this.reportsService.getIncomeSummary(startDate, endDate);
    }
}