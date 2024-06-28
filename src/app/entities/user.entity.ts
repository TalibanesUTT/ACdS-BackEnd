import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt";

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

    @Column({ default: false, name: "email_confirmed" })
    emailConfirmed: boolean;

    @Column({ default: false, name: "phone_confirmed" })
    phoneConfirmed: boolean;

    @Column({ default: false })
    active: boolean;

    @Column({
        type: "timestamp",
        name: "create_date",
        default: () => "CURRENT_TIMESTAMP",
    })
    createDate: Date;

    async comparePassword(attempt: string): Promise<boolean> {
        return await bcrypt.compare(attempt, this.password);;
    }
}
