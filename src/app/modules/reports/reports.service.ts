import { DatabaseService } from "@/app/services/database/database.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ReportsService {
    constructor(
        private readonly dbService: DatabaseService
    ){}

    async getAccountingBalance(year: number, month: number): Promise<any> {
        return this.dbService.executeProcedure("GetAccountingBalance", [year, month]);
    }

    async getExpenditureSummary(year: number, month: number): Promise<any> {
        return this.dbService.executeProcedure("GetExpenditureSummary", [year, month]);
    }

    async getIncomeSummary(startDate: string, endDate: string): Promise<any> {
        return this.dbService.executeProcedure("GetIncomeSummary", [startDate, endDate]);
    }
}
