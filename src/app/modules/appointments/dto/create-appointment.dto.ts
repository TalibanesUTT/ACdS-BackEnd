import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsString, Matches } from "class-validator";
import { ValuesConstants } from "src/constants/values-constants";

export class CreateAppointmentDto {
    @ApiProperty({
        description: "Fecha de la cita (YYYY-MM-DD)",
        example: "2024-08-01",
        type: String,
        format: "date",
    })
    @IsDate()
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
        example: "Consulta médica",
        type: String,
    })
    @IsString()
    reason: string;
    @ApiProperty({
        description: "Estado de la cita",
        example: ValuesConstants.AppointmentsPending,
        enum: new ValuesConstants(),
    })
    @IsEnum(ValuesConstants)
    status: ValuesConstants;
}
