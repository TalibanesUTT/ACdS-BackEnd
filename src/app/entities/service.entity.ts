import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ServiceOrder } from "./service-order.entity";

@Entity({
    name: "Services",  
})
export class Service {
    @PrimaryGeneratedColumn({
        unsigned: true,
    })
    id: number;

    @Column({
        unique: true,
        name: "service",
        type: "varchar",
        length: 30,
    })
    name: string;

    @ManyToMany(() => ServiceOrder, (serviceOrder) => serviceOrder.services)
    serviceOrders: ServiceOrder[];

    constructor(name: string) {
        this.name = name;
    }
}