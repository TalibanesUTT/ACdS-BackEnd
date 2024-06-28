import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import { Role } from "./role.entity";

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

    @Column({ unique: true, name: "phone_number" })
    phoneNumber: string;

    @Column()
    password: string;

    @Column({ nullable: true, name: "verification_code" })
    verificationCode: string;

    @Column({ default: false, name: "email_confirmed" })
    emailConfirmed: boolean;

    @Column({ default: false, name: "phone_confirmed" })
    phoneConfirmed: boolean;

    @Column({ default: true })
    active: boolean;

    @Column({
        type: "timestamp",
        name: "create_date",
        default: () => "CURRENT_TIMESTAMP",
    })
    createDate: Date;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: "role_id" })
    role: Role;

    async comparePassword(attempt: string): Promise<boolean> {
        console.log(attempt);
        return await bcrypt.compare(attempt, this.password);
    }
}
