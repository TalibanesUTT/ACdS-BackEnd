import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCarBrandDto {
    @ApiProperty({
        description: "The name of the car brand",
        example: "Toyota",
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(70, { message: "El nombre de la marca puede contener un máximo de 70 caracteres" })
    name: string;
}

export class UpdateCarBrandDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "The name of the car brand",
        example: "Toyota",
    })
    @MaxLength(70, { message: "El nombre de la marca puede contener un máximo de 70 caracteres" })
    name: string;
}
