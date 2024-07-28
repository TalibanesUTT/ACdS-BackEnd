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
        const brands = this.repository.find({
            take: limit,
        });
        if (!(await brands).length) {
            throw new NotFoundException("No hay marcas de autos registradas");
        }
        return brands;
    }

    async findOne(id: number): Promise<CarBrand> {
        try {
            return await this.repository.findOneByOrFail({ id });
        } catch (error) {
            Logger.error(error);
            throw new NotFoundException(`Marca de auto no encontrada`);
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

    async update(id: number, carBrand: CarBrand): Promise<CarBrand> {
        const car = await this.repository.findOneBy({ id });

        if (!car) {
            throw new BadRequestException(
                "El ID de la marca de auto no existe",
            );
        }

        try {
            return await this.repository.save({
                ...car,
                ...carBrand,
            });
        } catch (error) {
            Logger.error(error);
            throw new BadRequestException(
                "Error al actualizar la marca de auto",
            );
        }
    }
}
