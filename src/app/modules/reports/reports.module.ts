import { DatabaseModule } from "@/app/services/database/database.module";
import { Module } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { ReportsController } from "./reports.controller";

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [ReportsController],
    providers: [ReportsService],
    exports: [],
})
export class ReportsModule {}