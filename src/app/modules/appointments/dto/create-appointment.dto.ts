import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from "class-validator";

export class CreateAppointmentDto {
    @ApiProperty({ description: "El id del usuario", example: 1, type: Number })
    @IsOptional()
    @IsNumber()
    userId?: number;

    @ApiProperty({
        description: "Fecha de la cita (YYYY-MM-DD)",
        example: "2024-08-01",
        type: String,
        format: "date",
    })
    @IsNotEmpty({ message: "La fecha es obligatoria" })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: "El formato de la fecha es inválido, utilizar el formato YYYY-MM-DD",
    })
    date: string;

    @ApiProperty({
        description: "Hora de la cita (HH:mm)",
        example: "14:00",
        type: String,
    })
    @IsString()
    @IsNotEmpty({ message: "La hora es obligatoria" })
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "El formato de la hora es inválido, utilizar el formato HH:mm",
    })
    time: string;

    @ApiProperty({
        description: "Razón de la cita",
        example: "Auto no enciende",
        type: String,
    })
    @IsString()
    @IsNotEmpty({ message: "La razón de la cita es obligatoria" })
    reason: string;
}
