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
import { Appointment } from "./appointment.entity";

@Entity({
    name: "Users",
})
export class User {
    @PrimaryGeneratedColumn({ 
        type: "bigint",
        unsigned: true,
    })
    id: number;

    @Column({
        type: "varchar",
        length: 60,
    })
    name: string;

    @Column({
        name: "last_name",
        type: "varchar",
        length: 60,
    })
    lastName: string;

    @Column({ 
        type: "nvarchar",
        length: 100,
        unique: true 
    })
    email: string;

    @Column({ 
        name: "phone_number",
        type: "nvarchar",
        length: 10,
     })
    phoneNumber: string;

    @Exclude()
    @Column({
        type: "nvarchar",
        length: 100,
    })
    password: string;

    @Exclude()
    @Column({ 
        nullable: true, 
        name: "verification_code",
        type: "nvarchar",
        length: 100,
    })
    verificationCode: string;

    @Column({ 
        type: "boolean",
        default: false, 
        name: "email_confirmed" 
    })
    emailConfirmed: boolean;

    @Column({ 
        type: "boolean", 
        default: false, 
        name: "phone_confirmed" 
    })
    phoneConfirmed: boolean;

    @Column({ 
        type: "boolean", 
        default: false 
    })
    active: boolean;

    @Exclude()
    @Column({ 
        type: "boolean", 
        default: false, 
        name: "changed_by_admin" 
    })
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
    
    @OneToMany(() => Appointment, (appointment) => appointment.customer)
    appointments: Promise<Appointment[]>;

    async comparePassword(attempt: string): Promise<boolean> {
        return await bcrypt.compare(attempt, this.password);
    }

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }

    @BeforeInsert()
    @BeforeUpdate()
    async _hashPassword() {
        const isHashed =
            this.password.startsWith("$2a$") ||
            this.password.startsWith("$2b$") ||
            (this.password.startsWith("$2y$") && this.password.length === 60);
        if (!isHashed) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
    
    async hasAppointmentsOnDate(date: Date): Promise<boolean> { 
        const appointments = await this.appointments;
        return appointments.some(
            (appointment) =>
                appointment.date.toDateString() ===
                new Date(date).toDateString(),
        );
    }
}
