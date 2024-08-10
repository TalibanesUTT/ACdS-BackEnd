import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Matches } from "class-validator";

export class UpdateAppointmentDto {
    @ApiPropertyOptional({
        description: "El id del usuario",
        example: 1,
        type: Number,
    })
    @IsOptional()
    @IsNumber()
    userId?: number;

    @ApiPropertyOptional({
        description: "Fecha de la cita (YYYY-MM-DD)",
        example: "2024-08-01",
        type: String,
        format: "date",
    })
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: "El formato de la fecha es inválido, utilizar el formato YYYY-MM-DD",
    })
    date?: string;

    @ApiPropertyOptional({
        description: "Hora de la cita (HH:mm)",
        example: "14:00",
        type: String,
    })
    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "El formato de la hora es inválido, utilizar el formato HH:mm",
    })
    time?: string;

    @ApiPropertyOptional({
        description: "Razón de la cita",
        example: "Auto no enciende",
        type: String,
    })
    @IsOptional()
    @IsString()
    reason?: string;
}
