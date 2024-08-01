import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Vehicle } from "./vehicle.entity";
import { Appointment } from "./appointment.entity";
import { Service } from "./service.entity";

@Entity({
    name: 'ServiceOrders'
})
export class ServiceOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
        name: 'file_number'
    })
    fileNumber: string;

    @Column({
        name: 'initial_mileage'
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
}