import { Expenditure } from "@/app/entities/expenditure.entity";
import { ExpenditureData } from "@/app/interfaces/expenditure-data.interface";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validateAndTransformData } from "./transform-expenditure-data";

@Injectable()
export class ExpendituresService {
    constructor(
        @InjectRepository(Expenditure)
        private readonly expenditureRepository: Repository<Expenditure>
    ) {}

    async findOne(year: number, month: number): Promise<Expenditure> {
        try {
            const expenditure = await this.expenditureRepository.findOne({
                where: {
                    month,
                    year,
                }
            });
            
            if (!expenditure) {
                throw new NotFoundException(`No se encontraron egresos para este mes y año`);
            }
            return expenditure;
        } catch (error) {
            throw new NotFoundException(`No se encontraron egresos para este mes y año`);
        }
    }

    async create(dto: { data: ExpenditureData; month: number; year: number }): Promise<Expenditure> {
        const { month, year } = dto;
        if (month < 1 || month > 12 || year < 2020) {
            throw new BadRequestException('Mes o año inválido');
        }

        const validatedData: ExpenditureData = validateAndTransformData(dto.data);

        const existingExpendture = await this.expenditureRepository.findOne({
            where: {
                month: dto.month,
                year: dto.year,
            }
        })

        if (existingExpendture) {
            await this.expenditureRepository.update({ year, month }, { data: validatedData });
            return this.findOne(year, month);
        }

        const expenditure = this.expenditureRepository.create({
            data: validatedData,
            month,
            year,
        });

        return this.expenditureRepository.save(expenditure);
    }
}