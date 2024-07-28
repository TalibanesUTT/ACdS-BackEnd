import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CarBrand } from "./car-brand.entity";
import { Transform } from "class-transformer";
import { Vehicle } from "./vehicle.entity";

@Entity({
    name: "CarModels",
})
export class CarModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    model: string;

    @ManyToOne(() => CarBrand, (brand) => brand.models, {
        eager: true,
    })
    @JoinColumn({ name: "brand_id" })
    @Transform(({ value }) => value.name)
    brand: CarBrand;

    @OneToMany(() => Vehicle, (vehicle) => vehicle.model)
    vehicles: Vehicle[];
}