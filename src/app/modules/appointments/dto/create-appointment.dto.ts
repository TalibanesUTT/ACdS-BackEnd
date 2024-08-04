import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsString, Matches } from "class-validator";
import { AppointmentStatus } from "src/constants/values-constants";

export class CreateAppointmentDto {
    @ApiProperty({
        description: "Fecha de la cita (YYYY-MM-DD)",
        example: "2024-08-01",
        type: String,
        format: "date",
    })
    @IsDate({
        message:
            "El formato de la fecha es inválido, Utilizar el formato YYYY-MM-DD",
    })
    @Type(() => Date)
    date: Date;
    @ApiProperty({
        description: "Hora de la cita (HH:mm)",
        example: "14:00",
        type: String,
    })
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "El formato de la hora es inválido, Utilizar el formato HH:mm",
    })
    time: string;
    @ApiProperty({
        description: "Razón de la cita",
        example: "Auto no enciende",
        type: String,
    })
    @IsString()
    reason: string;
    @ApiProperty({
        description: "Estado de la cita",
        example: AppointmentStatus.AppointmentsPending,
        enum: AppointmentStatus,
    })
    @IsEnum(AppointmentStatus, {
        message: `El estado de la cita debe ser uno de los siguientes valores: ${Object.values(
            AppointmentStatus,
        ).join(", ")}`,
    })
    status: AppointmentStatus;
}
