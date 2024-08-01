import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Service } from "src/app/entities/service.entity";
import { Repository } from "typeorm";

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service)
        private readonly serviceRepository: Repository<Service>
    ) { }

    async findAll(): Promise<Service[]> {
        const services = await this.serviceRepository.find();

        if (!services.length) {
            throw new NotFoundException("No hay servicios registrados");
        }
        return services;
    }
}