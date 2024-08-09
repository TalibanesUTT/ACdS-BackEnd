import { AppointmentStatus } from "src/constants/values-constants";
import { User } from "./user.entity";
import {
    AfterLoad,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    ValueTransformer,
} from "typeorm";
import { Type } from "class-transformer";

export const timeTransformer: ValueTransformer = {
    to(value: string): string {
        if (!value) return value;
        // Append ":00" to store as hh:mm:ss
        return value;
    },
    from(value: string): string {
        if (!value) return value;
        // Return time in hh:mm format
        return value.slice(0, 5);
    },
};

@Entity({
    name: "Appointments",
})
export class Appointment {
    constructor(partial: Partial<Appointment>) {
        Object.assign(this, partial);
    }

    @PrimaryGeneratedColumn({ 
        type: "bigint",
        unsigned: true,
    })
    id: number;

    @Column({ type: "date" })
    @Type(() => Date)
    date: Date;

    @Column({ 
        type: "time",
        transformer: timeTransformer 
    })
    time: string;

    @Column({
        type: "nvarchar",
        length: 300,
    })
    reason: string;

    @Column({
        type: "enum",
        enum: AppointmentStatus,
        default: AppointmentStatus.AppointmentsPending,
    })
    status: AppointmentStatus;

    @Column({
        name: "create_date",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    })
    createDate: Date;

    @ManyToOne(() => User, (user) => user.appointments, { eager: true })
    @JoinColumn({ name: "customer_id" })
    customer: User;

    @AfterLoad()
    transformDate() {
        this.date = new Date(this.date);
    }
}
