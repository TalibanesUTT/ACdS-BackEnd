import { Injectable } from "@nestjs/common";
import { BaseSeederService } from "./base.seeder.service";
import { Service } from "src/app/entities/service.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

@Injectable()
export class ServiceSeederService extends BaseSeederService<Service> {
    constructor(
        @InjectRepository(Service)
        private readonly serviceRepository: Repository<Service>,
    ) {
        super();
    }

    protected get repository(): Repository<Service> {
        return this.serviceRepository;
    }

    protected getIdentity(entity: DeepPartial<Service>) {
        return entity.name;
    }

    protected get data(): Promise<DeepPartial<Service>[]> {
        return Promise.resolve([
            { name: "Afinación"},
            { name: "Bomba de agua"},
            { name: "Clutch"},
            { name: "Dirección hidráulica"},
            { name: "Frenos"},
            { name: "Suspensión"},
            { name: "Otros"},
        ]);
    }
}