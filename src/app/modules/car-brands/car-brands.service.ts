import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CarBrand } from "src/app/entities/car-brand.entity";
import { Repository } from "typeorm";

@Injectable()
export class CarBrandsService {
    constructor(
        @InjectRepository(CarBrand)
        private readonly repository: Repository<CarBrand>,
    ) {}

    async findAll(limit = 100): Promise<CarBrand[]> {
        return this.repository.find({
            take: limit,
        });
    }

    async findOne(id: number): Promise<CarBrand> {
        try {
            return this.repository.findOneByOrFail({ id });
        } catch (error) {
            if (error.name === "EntityNotFoundError") {
                throw new NotFoundException(
                    `Auto con el id: ${id} no encontrado`,
                );
            }
            Logger.error(error);
        }
    }

    async create(carBrand: CarBrand): Promise<CarBrand> {
        const carExists = await this.repository.findOne({
            where: { name: carBrand.name },
        });

        if (carExists) {
            throw new BadRequestException("La marca de auto ya existe");
        }

        try {
            return await this.repository.save(carBrand);
        } catch (error) {
            if (error.code === "23505") {
                throw new BadRequestException("La marca de auto ya existe");
            }
            Logger.error(error);
        }
    }
}
