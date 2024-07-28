import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CarBrand } from "src/app/entities/car-brand.entity";
import { CarModel } from "src/app/entities/car-model.entity";
import { Repository } from "typeorm";

@Injectable()
export class CarModelsService {
    constructor(
        @InjectRepository(CarModel)
        private readonly carModelRepository: Repository<CarModel>,
        @InjectRepository(CarBrand)
        private readonly carBrandRepository: Repository<CarBrand>
    ) { }

    async findByBrand(id: number): Promise<CarModel[]> {
        const carBrand = await this.carBrandRepository.findOneBy({ id })
        if (!carBrand) {
            throw new NotFoundException("Marca de vehículo no encontrada");
        }

        const carModels = await this.carModelRepository.find({
            where: { brand: carBrand },
        });

        if (!carModels.length) {
            throw new NotFoundException("No hay modelos de vehículos registrados para esta marca");
        }
        return carModels;
    }
}