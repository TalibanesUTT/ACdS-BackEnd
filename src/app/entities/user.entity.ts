import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import * as bcrypt from "bcrypt";
import { Role, RoleEnum } from "./role.entity";
import { Transform } from "class-transformer";

@Entity({
    name: "Users",
})
export class User {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @Column()
    name: string;

    @Column({
        name: "last_name",
    })
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ name: "phone_number" })
    phoneNumber: string;

    @Column()
    password: string;

    @Column({ nullable: true, name: "verification_code" })
    verificationCode: string;

    @Column({ type: "boolean", default: false, name: "email_confirmed" })
    emailConfirmed: boolean;

    @Column({ type: "boolean", default: false, name: "phone_confirmed" })
    phoneConfirmed: boolean;

    @Column({ type: "boolean", default: false })
    active: boolean;

    @Column({
        type: "timestamp",
        name: "create_date",
        default: () => "CURRENT_TIMESTAMP",
    })
    createDate: Date;

    @ManyToOne(() => Role, (role) => role.users, {
        eager: true,
    })
    @JoinColumn({ name: "role_id" })
    @Transform(({ value }) => value.value)
    role: RoleEnum;

    async comparePassword(attempt: string): Promise<boolean> {
        return await bcrypt.compare(attempt, this.password);
    }
}
