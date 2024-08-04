import { ServiceOrderStatus } from "@/constants/values-constants";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ServiceOrder } from "./service-order.entity";
import { User } from "./user.entity";

@Entity({
    name: 'HistoryServiceOrders'
})
export class HistoryServerOrder {
    @PrimaryGeneratedColumn({
        unsigned: true,
        type: 'bigint',
    })
    id: number;

    @Column({
        type: 'nvarchar',
        length: 255,
        nullable: true
    })
    comments?: string;

    @Column({
        type: 'enum',
        enum: ServiceOrderStatus,
        default: ServiceOrderStatus.ServiceOrdersReceived
    })
    status: ServiceOrderStatus;

    @Column({
        type: 'boolean',
        default: false
    })
    rollback: boolean;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    time: Date;

    @ManyToOne(() => ServiceOrder, (serviceOrder) => serviceOrder.history)
    @JoinColumn({ name: 'service_order_id' })
    serviceOrder: ServiceOrder;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}