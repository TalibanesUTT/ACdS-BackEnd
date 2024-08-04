import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CarModel } from "./car-model.entity";

@Entity({
    name: "CarBrands",
})
export class CarBrand {
    @PrimaryGeneratedColumn({
        unsigned: true,
    })
    id: number;

    @Column({
        unique: true,
        name: "brand",
        type: "varchar",
        length: 70,
    })
    name: string;

    @OneToMany(() => CarModel, (model) => model.brand)
    models: CarModel[];

    constructor(name: string) {
        this.name = name;
    }
}
