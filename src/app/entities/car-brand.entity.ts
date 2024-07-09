import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    constructor(name: string) {
        this.name = name;
    }
}
