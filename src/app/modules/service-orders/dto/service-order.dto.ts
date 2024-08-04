import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateServiceOrderDto {
    @ApiProperty({ description: "The file number of the service order", example: "SO-0001" })
    @IsNotEmpty({ message: "El número de expediente es obligatorio" })
    @IsString()
    @MaxLength(15, { message: "El número de expediente puede contener un máximo de 15 caracteres" })
    fileNumber: string;
    
    @ApiProperty({ description: "The id of the appointment", example: 1, required: false })
    @IsOptional()
    @IsNumber()
    appointmentId?: number;
    
    @ApiProperty({ description: "The id of the vehicle", example: 1 })
    @IsNotEmpty({ message: "El vehículo es obligatorio" })
    @IsNumber() 
    vehicleId: number;

    @ApiProperty({ description: "The initial mileage of the vehicle", example: 1000 })
    @IsNotEmpty({ message: "El kilometraje inicial del vehículo es obligatorio" })
    @IsNumber()
    initialMileage: number;

    @ApiProperty({ description: "The notes of the service order", example: "The vehicle is in good condition" })
    @IsNotEmpty({ message: "Las observaciones son obligatorias" })
    @IsString()
    notes: string;

    @ApiProperty({ description: "The id of the services", example: [1, 2, 3], required: false })
    @IsOptional()
    @IsNumber({}, { each: true })
    servicesIds?: number[];
}

export class UpdateServiceOrderDto {
    @ApiProperty({ description: "The file number of the service order", example: "SO-0001", required: false })
    @IsOptional()
    @IsString()
    @MaxLength(15, { message: "El número de expediente puede contener un máximo de 15 caracteres" })
    fileNumber?: string;
    
    @ApiProperty({ description: "The id of the appointment", example: 1, required: false })
    @IsOptional()
    @IsNumber()
    appointmentId?: number;
    
    @ApiProperty({ description: "The id of the vehicle", example: 1, required: false })
    @IsOptional()
    @IsNumber() 
    vehicleId?: number;

    @ApiProperty({ description: "The initial mileage of the vehicle", example: 1000, required: false })
    @IsOptional()
    @IsNumber()
    initialMileage?: number;

    @ApiProperty({ description: "The notes of the service order", example: "The vehicle is in good condition", required: false })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiProperty({ description: "The id of the services", example: [1, 2, 3], required: false })
    @IsOptional()
    @IsNumber({}, { each: true })
    servicesIds?: number[];
}