import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ServiceOrder } from "./service-order.entity";
import { Exclude, Type } from "class-transformer";

@Entity({
    name: 'ServiceOrdersDetails'
})
export class ServiceOrderDetail {
    @PrimaryGeneratedColumn({
        unsigned: true,
        type: 'bigint'
    })
    id: number;

    @Column({
        type: 'decimal',
        nullable: true,
        precision: 10,
        scale: 2,
    })
    @Type(() => Number)
    budget?: number;

    @Column({
        type: 'decimal',
        name: 'total_cost',
        nullable: true,
        precision: 10,
        scale: 2
    })
    @Type(() => Number)
    totalCost?: number;

    @Column({
        type: 'timestamp',
        name: 'departure_date',
        nullable: true
    })
    departureDate?: Date;

    @Column({
        name: 'final_mileage',
        nullable: true,
        type: 'integer',
        unsigned: true
    })
    finalMileage?: number;

    @Column({
        type: 'text',
        nullable: true
    })
    observations?: string;

    @Column({
        name: 'repair_days',
        type: 'smallint',
        nullable: true,
        unsigned: true
    })
    repairDays?: number;

    @Exclude()
    @OneToOne(() => ServiceOrder, (serviceOrder) => serviceOrder.detail)
    @JoinColumn({ name: 'service_order_id' })
    serviceOrder: ServiceOrder;
}