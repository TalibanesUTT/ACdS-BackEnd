import { Module } from "@nestjs/common";
import { ExpendituresController } from "./expenditures.controller";
import { ExpendituresService } from "./expenditures.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Expenditure } from "@/app/entities/expenditure.entity";
import { TimezoneDatesModule } from "@/app/services/timezone-dates/timezone-dates.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Expenditure]),
        TimezoneDatesModule,
    ],
    controllers: [ExpendituresController],
    providers: [ExpendituresService],
})
export class ExpendituresModule {}