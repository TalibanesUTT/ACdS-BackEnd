import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export enum RoleEnum {
    CUSTOMER = "customer",
    ROOT = "root",
    ADMIN = "admin",
    MECHANIC = "mechanic",
}

@Entity({
    name: "Roles",
})
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        enum: RoleEnum,
        name: "role",
    })
    value: RoleEnum;

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}
