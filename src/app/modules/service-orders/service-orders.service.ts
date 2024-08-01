import { Appointment } from "@/app/entities/appointment.entity";
import { ServiceOrder } from "@/app/entities/service-order.entity";
import { Service } from "@/app/entities/service.entity";
import { Vehicle } from "@/app/entities/vehicle.entity";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CreateServiceOrderDto, UpdateServiceOrderDto } from "./dto/service-order.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class ServiceOrdersService {
    constructor(
        @InjectRepository(ServiceOrder)
        private readonly serviceOrderRepository: Repository<ServiceOrder>,
        @InjectRepository(Vehicle)
        private readonly vehicleRepository: Repository<Vehicle>,
        @InjectRepository(Appointment)
        private readonly appointmentRepository: Repository<Appointment>,
        @InjectRepository(Service)
        private readonly serviceRepository: Repository<Service>,
        private readonly userService: UsersService
    ) {}

    async findAll(limit = 100): Promise<ServiceOrder[]> {
        const orders = await this.serviceOrderRepository.find({
            take: limit
        });

        if (!orders.length) {
            throw new NotFoundException('No hay órdenes de servicio registradas');
        }
        return orders;
    }

    async findOne(id: number): Promise<ServiceOrder> {
        try {
            const order = await this.serviceOrderRepository.findOneBy({ id });
            if (!order) {
                throw new NotFoundException('Orden de servicio no encontrada');
            }
            return order;
        } catch (error) {
            throw new NotFoundException('Orden de servicio no encontrada');
        }
    }

    async findByUser(userId: number): Promise<ServiceOrder[]> {
        const user = await this.userService.find(userId);

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const vehicles = await this.vehicleRepository.find({
            where: {
                owner: { id: user.id }
            }
        })
        const vehicleIds = vehicles.map(vehicle => vehicle.id);

        const orders = await this.serviceOrderRepository.find({
            where: {
                vehicle: { id: In(vehicleIds) }
            }
        })

        if (!orders.length) {
            throw new NotFoundException('No hay órdenes de servicio registradas para este usuario');
        }
        
        return orders;
    }

    async create(data: CreateServiceOrderDto): Promise<ServiceOrder> {
        const { vehicleId, appointmentId, servicesIds, fileNumber, ...rest } = data;

        const existingFileNumber = !!(await this.serviceOrderRepository.findOneBy({ fileNumber }));
        if (existingFileNumber) {
            throw new BadRequestException('El número de expediente ya se encuentra en uso');
        }

        let appointment = null;
        if (appointmentId) {
            appointment = await this.appointmentRepository.findOneBy({ id: appointmentId });
            if (!appointment) {
                throw new NotFoundException('Cita no encontrada');
            }
        }

        const vehicle = await this.vehicleRepository.findOneBy({ id: vehicleId });
        if (!vehicle) {
            throw new NotFoundException('Vehículo no encontrado');
        }

        const services = servicesIds ? await this.serviceRepository.findBy({ id: In(servicesIds) }) : [];

        const serviceOrder = this.serviceOrderRepository.create({
            ...rest,
            vehicle,
            appointment,
            services,
            fileNumber
        });

        return this.serviceOrderRepository.save(serviceOrder);
    }

    async update(id: number, data: UpdateServiceOrderDto): Promise<ServiceOrder> {
        const order = await this.serviceOrderRepository.findOneBy({ id });
        if (!order) {
            throw new NotFoundException('Orden de servicio no encontrada');
        }

        const { vehicleId, appointmentId, servicesIds, fileNumber, ...rest } = data;

        if (fileNumber && fileNumber !== order.fileNumber) {
            const existingFileNumber = !!(await this.serviceOrderRepository.findOneBy({ fileNumber }));
            if (existingFileNumber) {
                throw new BadRequestException('El número de expediente ya se encuentra en uso');
            }
        }

        if (vehicleId) {
            const vehicle = await this.vehicleRepository.findOneBy({ id: vehicleId });
            if (!vehicle) {
                throw new NotFoundException('Vehículo no encontrado');
            }
            order.vehicle = vehicle;
        }

        if (appointmentId !== undefined && appointmentId !== null) { 
            const appointment = await this.appointmentRepository.findOneBy({ id: appointmentId });
            if (!appointment) {
                throw new NotFoundException('Cita no encontrada');
            }
            order.appointment = appointment;
        }

        if (servicesIds !== undefined && servicesIds !== null) {
            const services = await this.serviceRepository.findBy({ id: In(servicesIds) });
            order.services = services;
        }

        const updatedOrder = this.serviceOrderRepository.merge(order, rest);
        return this.serviceOrderRepository.save(updatedOrder);
    }
}