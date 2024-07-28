import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CarModel } from "./car-model.entity";

@Entity({
    name: "CarBrands",
})
export class CarBrand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
        name: "brand",
    })
    name: string;

    @OneToMany(() => CarModel, (model) => model.brand)
    models: CarModel[];

    constructor(name: string) {
        this.name = name;
    }
}
