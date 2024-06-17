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

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    phoneNumber: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    verificationCode: string;

    @Column({ default: false })
    emailConfirmed: boolean;

    @Column({ default: false })
    phoneConfirmed: boolean;

    @Column({ default: true })
    active: boolean;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createDate: Date;

    async comparePassword(attempt: string): Promise<boolean> {
        console.log(attempt);
        return await bcrypt.compare(attempt, this.password);
    }
}
