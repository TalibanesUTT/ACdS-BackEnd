import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateServiceOrderDetailDto {
    @ApiProperty({ description: "The budget of the service order", example: 1000.50 })
    @IsOptional()   
    @IsNumber()
    @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
    budget: number;

    @ApiProperty({ description: "The total cost of the service order", example: 1200.50 })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
    totalCost?: number;

    @ApiProperty({ description: "The departure date of the vehicle", example: "2021-12-31T23:59:59" })
    @IsOptional()
    @IsDateString()
    departureDate?: Date;

    @ApiProperty({ description: "The final mileage of the vehicle", example: 1500 })
    @IsOptional()
    @IsNumber()
    finalMileage?: number;

    @ApiProperty({ description: "The observations of the service order", example: "The vehicle is in good condition" })
    @IsOptional()
    @IsString()
    observations?: string;
}