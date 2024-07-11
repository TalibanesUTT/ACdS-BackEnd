import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCarBrandDto {
    @ApiProperty({
        description: "The name of the car brand",
        example: "Toyota",
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class UpdateCarBrandDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "The name of the car brand",
        example: "Toyota",
    })
    name: string;
}
