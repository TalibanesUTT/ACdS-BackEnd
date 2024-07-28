import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CarBrand } from "src/app/entities/car-brand.entity";
import { CarModel } from "src/app/entities/car-model.entity";
import { Vehicle } from "src/app/entities/vehicle.entity";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { CreateVehicleDto, UpdateVehicleDto } from "./dto/vehicle.dto";

@Injectable()
export class VehiclesService {
    constructor(
        @InjectRepository(Vehicle)
        private readonly vehicleRepository: Repository<Vehicle>,
        @InjectRepository(CarBrand)
        private readonly carBrandRepository: Repository<CarBrand>,
        @InjectRepository(CarModel)
        private readonly carModelRepository: Repository<CarModel>,
        private readonly usersService: UsersService
    ) { }

    async findAll(limit = 100): Promise<Vehicle[]> {
        const vehicles = await this.vehicleRepository.find({
            take: limit
        });

        if (!vehicles.length) {
            throw new NotFoundException("No hay vehículos registrados");
        }

        return vehicles;
    }

    async findOne(id: number): Promise<Vehicle> {
        try {
            const vehicle = await this.vehicleRepository.findOneBy({ id });
            if (!vehicle) {
                throw new NotFoundException("Vehículo no encontrado");
            }
            return vehicle;
        } catch (error) {
            throw new NotFoundException("Vehículo no encontrado");
        }
    }

    async findByOwner(ownerId: number): Promise<Vehicle[]> {
        const owner = await this.usersService.find(ownerId);
        if (!owner) {
            throw new NotFoundException("Dueño no encontrado");
        }

        const vehicles = await this.vehicleRepository.find({
            where: { owner }
        });

        if (!vehicles.length) {
            throw new NotFoundException("No hay vehículos registrados para este dueño");
        }

        return vehicles;
    }

    async create(data: CreateVehicleDto): Promise<Vehicle> {
        const { ownerId, brandId, model, serialNumber, ...rest } = data;
        const owner = await this.usersService.find(ownerId);
        if (!owner) {
            throw new NotFoundException("Dueño no encontrado");
        }

        const brand = await this.carBrandRepository.findOneBy({ id: brandId });
        if (!brand) {
            throw new NotFoundException("Marca no encontrada");
        }
        
        const existingSerialNumber = !!(await this.vehicleRepository.findOneBy({ serialNumber }));
        if (existingSerialNumber) {
            throw new BadRequestException("El número de serie ya se encuentra en uso");
        }

        let carModel = await this.carModelRepository.findOne({
            where: { model, brand }
        })
        if (!carModel) {
            carModel = this.carModelRepository.create({ model, brand });
            await this.carModelRepository.save(carModel);
        }

        const vehicle = this.vehicleRepository.create({
            owner,
            model: carModel,
            serialNumber,
            ...rest
        });

        return this.vehicleRepository.save(vehicle);
    }

    async update(id: number, data: UpdateVehicleDto): Promise<Vehicle> {
        const vehicle = await this.vehicleRepository.findOne({
            where: { id },
            relations: ["owner", "model", "model.brand"]
        });

        if (!vehicle) {
            throw new NotFoundException("Vehículo no encontrado");
        }

        const { ownerId, brandId, model, serialNumber, ...rest } = data;

        if (ownerId && vehicle.owner.id !== ownerId) {
            const owner = await this.usersService.find(ownerId);
            if (!owner) {
                throw new NotFoundException("Dueño no encontrado");
            }
            vehicle.owner = owner;
        }

        if (serialNumber && vehicle.serialNumber !== serialNumber) {
            const existingSerialNumber = !!(await this.vehicleRepository.findOneBy({ serialNumber }));
            if (existingSerialNumber) {
                throw new BadRequestException("El número de serie ya se encuentra en uso");
            }
            vehicle.serialNumber = serialNumber;
        }

        let currentModel = vehicle.model;
        if (brandId || model) {
            let brand = vehicle.model.brand;

            if (brandId && vehicle.model.brand.id !== brandId) {
                brand = await this.carBrandRepository.findOneBy({ id: brandId });
                if (!brand) {
                    throw new NotFoundException("Marca no encontrada");
                }
            }

            let carModel = await this.carModelRepository.findOne({
                where: { model, brand }
            })
            if (!carModel) {
                carModel = this.carModelRepository.create({ model, brand });
                await this.carModelRepository.save(carModel);
            }

            vehicle.model = carModel;
        } 

        const updatedVehicle = this.vehicleRepository.merge(vehicle, rest);
        await this.vehicleRepository.save(updatedVehicle);

        const modelUsageCount = await this.vehicleRepository.count({
            where: { model: currentModel }
        });

        if (modelUsageCount === 0) {
            await this.carModelRepository.remove(currentModel);
        }

        return updatedVehicle;
    }
}