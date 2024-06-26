import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
    })
    role: RoleEnum;
}
