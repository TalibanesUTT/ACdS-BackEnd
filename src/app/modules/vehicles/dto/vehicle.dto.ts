import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateVehicleDto {
    @ApiProperty({ description: "The id of the owner", example: 1 })
    @IsNotEmpty({ message: "El dueño del vehículo es obligatorio" })
    @IsNumber()
    ownerId: number;

    @ApiProperty({ description: "The id of the brand of the vehicle", example: 1 })
    @IsNotEmpty({ message: "La marca del vehículo es obligatoria" })
    @IsNumber()
    brandId: number;

    @ApiProperty({ description: "The model of the vehicle", example: "Corolla" })
    @IsNotEmpty({ message: "El modelo del vehículo es obligatorio" })
    @IsString()
    @MaxLength(100, { message: "El modelo del vehículo puede contener un máximo de 100 caracteres" })
    model: string;

    @ApiProperty({ description: "The year of the vehicle", example: 2020 })
    @IsNotEmpty({ message: "El año del vehículo es obligatorio" })
    @IsNumber()
    year: number;

    @ApiProperty({ description: "The color of the vehicle", example: "Red" })
    @IsNotEmpty({ message: "El color del vehículo es obligatorio" })
    @IsString()
    @MaxLength(25, { message: "El color del vehículo puede contener un máximo de 25 caracteres" })
    color: string;

    @ApiProperty({ description: "The license plate of the vehicle", example: "ABC123" })
    @IsNotEmpty({ message: "Las placas del vehículo son obligatorias" })
    @MaxLength(15, { message: "Las placas del vehículo pueden contener un máximo de 15 caracteres" })
    plates: string;

    @ApiProperty({ description: "The serial number of the vehicle", example: "1234567890" })
    @IsOptional()
    @IsString()
    @MaxLength(20, { message: "El número de serie del vehículo puede contener un máximo de 20 caracteres" })
    serialNumber?: string;
}

export class UpdateVehicleDto {
    @ApiProperty({ description: "The id of the owner", example: 1 })
    @IsOptional()
    @IsNumber()
    ownerId: number;

    @ApiProperty({ description: "The id of the brand of the vehicle", example: 1 })
    @IsOptional()
    @IsNumber()
    brandId: number;

    @ApiProperty({ description: "The model of the vehicle", example: "Corolla" })
    @IsOptional()
    @IsString()
    @MaxLength(100, { message: "El modelo del vehículo puede contener un máximo de 100 caracteres" })
    model: string;

    @ApiProperty({ description: "The year of the vehicle", example: 2020 })
    @IsOptional()
    @IsNumber()
    year: number;

    @ApiProperty({ description: "The color of the vehicle", example: "Red" })
    @IsOptional()
    @IsString()
    @MaxLength(25, { message: "El color del vehículo puede contener un máximo de 25 caracteres" })
    color: string;

    @ApiProperty({ description: "The license plate of the vehicle", example: "ABC123" })
    @IsOptional()
    @MaxLength(15, { message: "Las placas del vehículo pueden contener un máximo de 15 caracteres" })
    plates: string;

    @ApiProperty({ description: "The serial number of the vehicle", example: "1234567890" })
    @IsOptional()
    @IsString()
    @MaxLength(20, { message: "El número de serie del vehículo puede contener un máximo de 20 caracteres" })
    serialNumber?: string;
}