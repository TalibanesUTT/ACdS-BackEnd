import { Appointment } from "@/app/entities/appointment.entity";
import { ServiceOrder } from "@/app/entities/service-order.entity";
import { Service } from "@/app/entities/service.entity";
import { Vehicle } from "@/app/entities/vehicle.entity";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CreateServiceOrderDto, UpdateServiceOrderDto } from "./dto/service-order.dto";
import { UsersService } from "../users/users.service";
import { CreateServiceOrderDetailDto } from "./dto/service-order-detail.dto";
import { ServiceOrderDetail } from "@/app/entities/service-order-detail.entity";
import { User } from "@/app/entities/user.entity";
import { HistoryServerOrder } from "@/app/entities/history-server-order.entity";
import { AppointmentStatus, ServiceOrderStatus } from "@/constants/values-constants";
import { TextConstants } from "@/constants/text-constants";
import { StatusDto } from "./dto/status.dto";
import { ServiceOrderStatusFlow } from "./status-flow";

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
        @InjectRepository(ServiceOrderDetail)
        private readonly detailRepository: Repository<ServiceOrderDetail>,
        @InjectRepository(HistoryServerOrder)
        private readonly historyRepository: Repository<HistoryServerOrder>,
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

    async findByVehicle(vehicleId: number): Promise<ServiceOrder[]> {
        const vehicle = await this.vehicleRepository.findOneBy({ id: vehicleId });

        if (!vehicle) {
            throw new NotFoundException('Vehículo no encontrado');
        }

        const orders = await this.serviceOrderRepository.find({
            where: {
                vehicle: { id: vehicle.id }
            }
        })

        if (!orders.length) {
            throw new NotFoundException('No hay órdenes de servicio registradas para este vehículo');
        }
        
        return orders;
    }
    async create(data: CreateServiceOrderDto, user: User): Promise<ServiceOrder> {
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

            appointment.status = AppointmentStatus.AppointmentsCompleted;
            await this.appointmentRepository.save(appointment);
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

        await this.serviceOrderRepository.save(serviceOrder);
        const historyEntry = this.historyRepository.create({
            serviceOrder,
            user,
            status: ServiceOrderStatus.ServiceOrdersReceived,
            comments: TextConstants.TextReceivedStatusComment
        });
        await this.historyRepository.save(historyEntry);

        return serviceOrder;
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

        if (vehicleId && vehicleId !== order.vehicle.id) {
            const vehicle = await this.vehicleRepository.findOneBy({ id: vehicleId });
            if (!vehicle) {
                throw new NotFoundException('Vehículo no encontrado');
            }
            order.vehicle = vehicle;
        }

        if (appointmentId !== undefined && appointmentId !== null && appointmentId !== order.appointment.id) { 
            const appointment = await this.appointmentRepository.findOneBy({ id: appointmentId });
            if (!appointment) {
                throw new NotFoundException('Cita no encontrada');
            }

            if (order.appointment) {
                order.appointment.status = AppointmentStatus.AppointmentsPending;
                await this.appointmentRepository.save(order.appointment);
            }

            appointment.status = AppointmentStatus.AppointmentsCompleted;
            await this.appointmentRepository.save(appointment);
        }

        if (servicesIds !== undefined && servicesIds !== null) {
            const services = await this.serviceRepository.findBy({ id: In(servicesIds) });
            order.services = services;
        }

        const updatedOrder = this.serviceOrderRepository.merge(order, rest);
        return this.serviceOrderRepository.save(updatedOrder);
    }

    async addDetail(orderId: number, data: CreateServiceOrderDetailDto): Promise<ServiceOrder> {
        const serviceOrder = await this.serviceOrderRepository.findOne({
            where: { id: orderId },
            relations: ['detail', 'services']
        })

        if (!serviceOrder) {
            throw new NotFoundException('Orden de servicio no encontrada');
        }

        if  (!serviceOrder.services || serviceOrder.services.length === 0) {
            throw new BadRequestException('La orden de servicio no tiene servicios asociados');
        }

        const { departureDate, ...rest } = data;

        if (departureDate && new Date(departureDate).getTime() < new Date(serviceOrder.createDate).getTime()) {
            throw new BadRequestException('La fecha de salida no puede ser anterior a la fecha de creación de la orden de servicio');
        }

        const repairDays = departureDate ? 
            Math.ceil((new Date(departureDate).getTime() - new Date(serviceOrder.createDate).getTime()) / (1000 * 60 * 60 * 24)) : 
            (serviceOrder.detail && serviceOrder.detail.departureDate ? serviceOrder.detail.repairDays : null);

        let detail = null;
        const detailData = {
            ...rest,
            departureDate: departureDate ? new Date(departureDate) : (serviceOrder.detail ? serviceOrder.detail.departureDate : null),
            repairDays,
            serviceOrder
        };

        if (serviceOrder.detail) {
            detail = Object.assign({}, serviceOrder.detail);
            detail = this.detailRepository.merge(detail, detailData);
        } else {
            detail = this.detailRepository.create(detailData);
        }

        await this.detailRepository.save(detail);

        serviceOrder.detail = detail;
        return this.serviceOrderRepository.save(serviceOrder);
    }

    async updateStatus(orderId: number, user: User, data: StatusDto): Promise<ServiceOrder> {
        const order = await this.serviceOrderRepository.findOne({
            where: { id: orderId },
            relations: ['history']
        })
        if (!order) {
            throw new NotFoundException('Orden de servicio no encontrada');
        }

        const currentStatusIndex = ServiceOrderStatusFlow.findIndex(status => status === order.actualStatus);
        if (currentStatusIndex === -1 && (order.actualStatus !== ServiceOrderStatus.ServiceOrdersOnHold && order.actualStatus !== ServiceOrderStatus.ServiceOrdersCancelled)) {
            throw new BadRequestException('El estado actual de la orden de servicio no es válido');
        }

        let newStatus = null;
        if ((data.cancel || data.onHold) && !data.comments) {
            const message = data.cancel ? 'cancelar' : 'poner en espera';
            throw new BadRequestException(`Es necesario agregar un comentario para ${message} la orden de servicio`);
        }

        if (data.cancel) {
            if (order.actualStatus === ServiceOrderStatus.ServiceOrdersCancelled) {
                throw new BadRequestException('La orden de servicio ya se encuentra cancelada');
            }

            if (order.actualStatus === ServiceOrderStatus.ServiceOrdersOnHold) {
                const historyEntries = await this.historyRepository.find({
                    where: { serviceOrder: order },
                    order: { time: 'DESC' }
                });

                if (!historyEntries.length) { 
                    throw new BadRequestException('No se encontró un historial previo para la orden de servicio');
                }

                const wasApprovedOrHigher = historyEntries.some(entry =>
                    ServiceOrderStatusFlow.indexOf(entry.status) >= ServiceOrderStatusFlow.indexOf(ServiceOrderStatus.ServiceOrdersApproved) &&
                    !entry.rollback
                );

                if (wasApprovedOrHigher) {
                    throw new BadRequestException('No se puede cancelar la orden de servicio, ya ha sido aprobada');
                }
            } else {
                if (currentStatusIndex >= ServiceOrderStatusFlow.indexOf(ServiceOrderStatus.ServiceOrdersApproved)) {
                    throw new BadRequestException('No se puede cancelar la orden de servicio, ya ha sido aprobada');
                }
            }

            newStatus = ServiceOrderStatus.ServiceOrdersCancelled;
        } else if (data.onHold) {
            if (order.actualStatus === ServiceOrderStatus.ServiceOrdersOnHold) {
                throw new BadRequestException('La orden de servicio ya se encuentra en espera');
            }

            if (order.actualStatus === ServiceOrderStatus.ServiceOrdersCancelled) {
                throw new BadRequestException('No se puede poner en espera la orden de servicio, ya ha sido cancelada');
            }

            if (currentStatusIndex >= ServiceOrderStatusFlow.indexOf(ServiceOrderStatus.ServiceOrdersReadyToPickUp)) {
                throw new BadRequestException('No se puede poner en espera la orden de servicio, ya ha sido entregada');
            }

            newStatus = ServiceOrderStatus.ServiceOrdersOnHold;
        } else if (data.rollback) {
            if (order.actualStatus === ServiceOrderStatus.ServiceOrdersReceived) {
                throw new BadRequestException('No se puede revertir el estatus de la orden de servicio');
            }

            const lastHistoryEntry = await this.historyRepository.findOne({
                where: { serviceOrder: order, rollback: false },
                order: { time: 'DESC' }
            });
            if (!lastHistoryEntry) { 
                throw new BadRequestException('No se encontró un historial previo para la orden de servicio');
            }

            lastHistoryEntry.rollback = true;
            await this.historyRepository.save(lastHistoryEntry);
            
            const updatedOrder = this.serviceOrderRepository.findOne({
                where: { id: orderId },
                relations: ['history']
            })
            return updatedOrder;
        } else {
            if (order.actualStatus === ServiceOrderStatus.ServiceOrdersCancelled || order.actualStatus === ServiceOrderStatus.ServiceOrdersFinished) { 
                const isCancelled = order.actualStatus === ServiceOrderStatus.ServiceOrdersCancelled;
                const message = isCancelled ? 'cancelada' : 'finalizada';
                throw new BadRequestException(`La orden de servicio ya se encuentra ${message} y no se puede modificar`);
            }

            if (order.actualStatus === ServiceOrderStatus.ServiceOrdersOnHold) {
                const historyEntries = await this.historyRepository.find({
                    where: { serviceOrder: order },
                    order: { time: 'DESC' }
                });

                if (!historyEntries.length) { 
                    throw new BadRequestException('No se encontró un historial previo para la orden de servicio');
                }

                const validHistoryEntry = historyEntries.find(entry =>
                    entry.status !== ServiceOrderStatus.ServiceOrdersOnHold && 
                    entry.status !== ServiceOrderStatus.ServiceOrdersCancelled &&
                    !entry.rollback
                );

                if (validHistoryEntry) {
                    newStatus = validHistoryEntry.status;
                } else {
                    throw new BadRequestException('No se encontró un historial válido para la orden de servicio');
                }
            } else {
                newStatus = ServiceOrderStatusFlow[currentStatusIndex + 1];   
            }
        }

        if (newStatus) {
            const newHistoryEntry = this.historyRepository.create({
                serviceOrder: order,
                user,
                status: newStatus,
                comments: data.comments,
                rollback: false
            })

            await this.historyRepository.save(newHistoryEntry);
            const updatedOrder = this.serviceOrderRepository.findOne({
                where: { id: orderId },
                relations: ['history']
            })

            return updatedOrder;
        }

        return order;
    }
}