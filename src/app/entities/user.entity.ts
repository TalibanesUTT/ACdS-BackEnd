import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import * as bcrypt from "bcrypt";
import { Role } from "./role.entity";
import { Exclude, Transform } from "class-transformer";
import { Vehicle } from "./vehicle.entity";

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

    @Exclude()
    @Column()
    password: string;

    @Exclude()
    @Column({ nullable: true, name: "verification_code" })
    verificationCode: string;

    @Column({ type: "boolean", default: false, name: "email_confirmed" })
    emailConfirmed: boolean;

    @Column({ type: "boolean", default: false, name: "phone_confirmed" })
    phoneConfirmed: boolean;

    @Column({ type: "boolean", default: false })
    active: boolean;

    @Exclude()
    @Column({ type: "boolean", default: false, name: "changed_by_admin" })
    changedByAdmin: boolean;

    @Exclude()
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
    role: Role;

    @OneToMany(() => Vehicle, (vehicle) => vehicle.owner)
    vehicles: Vehicle[];

    async comparePassword(attempt: string): Promise<boolean> {
        return await bcrypt.compare(attempt, this.password);
    }

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }

    @BeforeInsert()
    @BeforeUpdate()
    private async _hashPassword() {
        const isHashed =
            this.password.startsWith("$2a$") ||
            this.password.startsWith("$2b$") ||
            (this.password.startsWith("$2y$") && this.password.length === 60);
        if (!isHashed) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
}
