import { Module } from "@nestjs/common";
import { ExpendituresController } from "./expenditures.controller";
import { ExpendituresService } from "./expenditures.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Expenditure } from "@/app/entities/expenditure.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Expenditure])],
    controllers: [ExpendituresController],
    providers: [ExpendituresService],
})
export class ExpendituresModule {}