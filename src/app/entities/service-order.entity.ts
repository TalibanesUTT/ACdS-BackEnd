import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Vehicle } from "./vehicle.entity";
import { Appointment } from "./appointment.entity";
import { Service } from "./service.entity";
import { ServiceOrderDetail } from "./service-order-detail.entity";
import { Expose, Transform } from "class-transformer";
import { HistoryServerOrder } from "./history-server-order.entity";
import { ServiceOrderStatus } from "@/constants/values-constants";

@Entity({
    name: 'ServiceOrders'
})
export class ServiceOrder {
    @PrimaryGeneratedColumn({
        unsigned: true,
        type: 'bigint'
    })
    id: number;

    @Column({
        unique: true,
        name: 'file_number',
        type: 'nvarchar',
        length: 15,
    })
    fileNumber: string;

    @Column({
        name: 'initial_mileage',
        unsigned: true,
    })
    initialMileage: number;

    @Column({
        type: 'text'
    })
    notes: string;

    @Column({
        type: 'timestamp',
        name: 'create_date',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createDate: Date;

    @ManyToOne(() => Vehicle, (vehicle) => vehicle.serviceOrders, {
        eager: true
    })
    @JoinColumn({ name: 'vehicle_id' })
    vehicle: Vehicle;

    @OneToOne(() => Appointment, {
        nullable: true,
        eager: true
    })
    @JoinColumn({ name: 'appointment_id' })
    appointment?: Appointment;

    @ManyToMany(() => Service, (service) => service.serviceOrders, {
        eager: true
    })
    @JoinTable({
        name: 'ServicesOrderServices',
        joinColumn: {
            name: 'service_order_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'service_id',
            referencedColumnName: 'id'
        }
    })
    services: Service[];

    @OneToOne(() => ServiceOrderDetail, (detail) => detail.serviceOrder, {
        eager: true,
        cascade: true
    })
    @Transform(({ value }) => {
        if (value) {
            const { serviceOrder, ...rest } = value;
            return rest;
        }
        return null;
    })
    detail: ServiceOrderDetail;

    @OneToMany(() => HistoryServerOrder, (history) => history.serviceOrder, {
        eager: true
    })
    history: HistoryServerOrder[];

    @Expose()
    get actualStatus(): ServiceOrderStatus | null {
        if (!this.history){
            return null;
        }
        const validStatus = this.history
            .filter(history => !history.rollback)
            .sort((a, b) => b.time.getTime() - a.time.getTime());
        return validStatus.length > 0 ? validStatus[0].status : null;
    }
}