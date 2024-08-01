import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ServiceOrder } from "./service-order.entity";

@Entity({
    name: "Services",  
})
export class Service {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
        name: "service",
    })
    name: string;

    @ManyToMany(() => ServiceOrder, (serviceOrder) => serviceOrder.services)
    serviceOrders: ServiceOrder[];

    constructor(name: string) {
        this.name = name;
    }
}