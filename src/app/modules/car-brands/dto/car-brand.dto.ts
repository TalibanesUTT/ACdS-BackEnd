import { ApiProperty } from "@nestjs/swagger";

export class CreateCarBrandDto {
    @ApiProperty({
        description: "The name of the car brand",
        example: "Toyota",
    })
    name: string;
}

export class UpdateCarBrandDto {
    @ApiProperty({
        description: "The name of the car brand",
        example: "Toyota",
    })
    name: string;
}
