import { ValuesConstants } from "src/constants/values-constants";
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
import { NotAcceptableException } from "@nestjs/common";
import { Exclude, Type } from "class-transformer";

export const timeTransformer: ValueTransformer = {
    to(value: string): string {
        if (!value) return value;
        // Ensure the value is in hh:mm format
        if (!/^\d{2}:\d{2}$/.test(value)) {
            throw new Error("Invalid time format. Expected hh:mm.");
        }
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
    // Validations:
    @Exclude()
    private readonly WORKING_DAYS = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
    ];
    @Exclude()
    private readonly WORKING_HOURS = {
        start: "09:00",
        end: "18:30",
    };

    constructor(partial: Partial<Appointment>) {
        Object.assign(this, partial);
    }
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;
    @Column({ type: "date" })
    @Type(() => Date)
    date: Date;
    @Column({ type: "time", transformer: timeTransformer })
    time: string;
    @Column()
    reason: string;
    @Column({
        type: "enum",
        enum: ValuesConstants,
        default: ValuesConstants.AppointmentsPending,
    })
    status: ValuesConstants;
    @ManyToOne(() => User, (user) => user.appointments, { eager: true })
    @JoinColumn({ name: "customer_id" })
    customer: User;

    @AfterLoad()
    transformDate() {
        this.date = new Date(this.date);
    }

    @Exclude()
    isValidDay = () =>
        this.WORKING_DAYS.includes(
            this.date.toLocaleDateString("en-US", { weekday: "long" }),
        );

    @Exclude()
    inWorkingHours = () => {
        const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timePattern.test(this.time)) {
            console.log(this.time);
            throw new NotAcceptableException(
                "El formato de la hora es inválido, Utilizar el formato HH:mm",
            );
        }
        return (
            this.time >= this.WORKING_HOURS.start &&
            this.time <= this.WORKING_HOURS.end
        );
    };

    isValidAppointmentDate = () => {
        const currentDate = new Date();
        const selectedDate = new Date(this.date);

        // Revisar si el dia seleccionado es mayor o igual al dia actual
        const today = new Date(currentDate.setHours(0, 0, 0, 0));
        const selectedDay = new Date(selectedDate.setHours(0, 0, 0, 0));

        if (selectedDay < today) {
            throw new NotAcceptableException(
                "La fecha de la cita debe ser mayor o igual a la fecha actual",
            );
        }

        // Combinar el tiempo seleccionado con la fecha seleccionada
        const [hours, minutes] = this.time.split(":").map(Number);
        selectedDate.setHours(hours, minutes, 0, 0);

        // Revisar si la hora seleccionada es mayor a la hora actual + 1 hora
        const currentTimePlusOneHour = new Date(currentDate);
        currentTimePlusOneHour.setHours(currentDate.getHours() + 1);

        if (selectedDate < currentTimePlusOneHour) {
            throw new NotAcceptableException(
                "La hora de la cita debe ser al menos 1 hora mayor a la hora actual",
            );
        }
    };

    validate = () => {
        if (!this.isValidDay())
            throw new NotAcceptableException(
                "El día seleccionado no es válido, las citas solo se pueden agendar de lunes a viernes",
            );
        if (!this.inWorkingHours())
            throw new NotAcceptableException(
                `El horario seleccionado no es válido, las citas solo se pueden agendar de ${this.WORKING_HOURS.start} a ${this.WORKING_HOURS.end}, fecha proporcionada: ${this.time}`,
            );
        this.isValidAppointmentDate();
    };
}
