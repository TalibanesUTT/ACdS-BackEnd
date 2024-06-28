import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export enum RoleEnum {
    GUEST = "guest",
    ADMIN = "admin",
    USER = "user",
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
