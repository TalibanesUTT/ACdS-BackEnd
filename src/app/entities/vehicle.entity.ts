import { Exclude, Transform } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { CarModel } from "./car-model.entity";
import { ServiceOrder } from "./service-order.entity";

@Entity({
    name: "Vehicles",
})
export class Vehicle {
    @PrimaryGeneratedColumn({
        unsigned: true,
        type: "bigint",
    })
    id: number;

    @Column({
        unique: true,
        name: "serial_number",
        type: "nvarchar",
        length: 20,
    })
    serialNumber: string;

    @Column({
        type: "smallint",
        unsigned: true,
    })
    year: number;

    @Column({
        type: "varchar",
        length: 25,
    })
    color: string;

    @Column({
        type: "nvarchar",
        length: 15,
    })
    plates: string;

    @Exclude()
    @Column({
        type: "timestamp",
        name: "create_date",
        default: () => "CURRENT_TIMESTAMP",
    })
    createDate: Date;

    @ManyToOne(() => User, (user) => user.vehicles, {
        eager: true,
    })
    @JoinColumn({ name: "owner_id" })
    @Transform(({ value }) => `${value.name} ${value.lastName}`)
    owner: User;

    @ManyToOne(() => CarModel, (model) => model.vehicles, {
        eager: true,
    })
    @JoinColumn({ name: "model_id" })
    model: CarModel;

    @OneToMany(() => ServiceOrder, (serviceOrder) => serviceOrder.vehicle)
    serviceOrders: ServiceOrder[];
}