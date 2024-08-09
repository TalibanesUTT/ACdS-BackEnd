import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from "class-validator";

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
    @IsDate({
        message: "El formato de la fecha es inválido, Utilizar el formato YYYY-MM-DD",
    })
    @IsNotEmpty({ message: "La fecha es obligatoria" })
    @Transform(({ value }) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error("La fecha es inválida");
        }
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    })
    date: Date;

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
