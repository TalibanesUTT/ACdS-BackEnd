import { Exclude, Transform } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { CarModel } from "./car-model.entity";

@Entity({
    name: "Vehicles",
})
export class Vehicle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
        name: "serial_number",
    })
    serialNumber: string;

    @Column()
    year: number;

    @Column()
    color: string;

    @Column()
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
    @Transform(({ value }) => value.model)
    model: CarModel;
}