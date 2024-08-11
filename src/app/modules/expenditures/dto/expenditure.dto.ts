import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsObject, IsOptional, ValidateNested } from "class-validator";

export class ExpenditureDataDto {
    @ApiProperty({ description: "The amount of money spent on spare parts", example: 1000.50 })
    @IsOptional()
    @IsNumber()
    spareParts?: number;

    @ApiProperty({ description: "The amount of money spent on payroll", example: 1200.50 })
    @IsOptional()
    @IsNumber()
    payroll?: number;

    @ApiProperty({ description: "The amount of money spent on cleaning", example: 500.50 })
    @IsOptional()
    @IsNumber()
    cleaning?: number;

    @ApiProperty({ description: "The amount of money spent on water", example: 100.50 })
    @IsOptional()
    @IsNumber()
    water?: number;

    @ApiProperty({ description: "The amount of money spent on electricity", example: 200.50 })
    @IsOptional()
    @IsNumber()
    electricity?: number;

    @ApiProperty({ description: "The amount of money spent on radios", example: 300.50 })
    @IsOptional()
    @IsNumber()
    radios?: number;

    @ApiProperty({ description: "The amount of money spent on telephones", example: 400.50 })
    @IsOptional()
    @IsNumber()
    telephones?: number;

    @ApiProperty({ description: "The amount of money spent on petty cash", example: 400.50 })
    @IsOptional()
    @IsNumber()
    pettyCash?: number;

    @ApiProperty({ description: "The amount of money spent on vacation", example: 500.50 })
    @IsOptional()
    @IsNumber()
    vacation?: number;

    @ApiProperty({ description: "The amount of money spent on insurance policies", example: 600.50 })
    @IsOptional()
    @IsNumber()
    insurancePolicies?: number;

    @ApiProperty({ description: "The amount of money spent on the Christmas bonus fund", example: 700.50 })
    @IsOptional()
    @IsNumber()
    christmasBonusFund?: number;

    @ApiProperty({ description: "The amount of money spent on vehicle repair service", example: 800.50 })
    @IsOptional()
    @IsNumber()
    vehicleRepairService?: number;

    @ApiProperty({ description: "The amount of money spent on workshop maintenance", example: 900.50 })
    @IsOptional()
    @IsNumber()
    workshopMaintenance?: number;

    @ApiProperty({ description: "The amount of money spent on office equipment", example: 1000.50 })
    @IsOptional()
    @IsNumber()
    officeEquipment?: number;

    @ApiProperty({ description: "The amount of money spent on administrative services", example: 1100.50 })
    @IsOptional()
    @IsNumber()
    administrativeServices?: number;

    @ApiProperty({ description: "The amount of money spent on tax payments", example: 1200.50 })
    @IsOptional()
    @IsNumber()
    taxPayments?: number;

    @ApiProperty({ description: "The amount of money spent on workshop rents", example: 1300.50 })
    @IsOptional()
    @IsNumber()
    workshopRents?: number;

    @ApiProperty({ description: "The amount of money spent on sponsorship advertising", example: 1400.50 })
    @IsOptional()
    @IsNumber()
    sponsorshipAdvertising?: number;

    @ApiProperty({ description: "The amount of money spent on workshop materials and tools", example: 1500.50 })
    @IsOptional()
    @IsNumber()
    workshopMaterialsTools?: number;

    @ApiProperty({ description: "The amount of money spent on gasoline vouchers", example: 1600.50 })
    @IsOptional()
    @IsNumber()
    gasolineVouchers?: number;

    @ApiProperty({ description: "The amount of money spent on settlement", example: 1700.50 })
    @IsOptional()
    @IsNumber()
    settlement?: number;

    @ApiProperty({ description: "The amount of money spent on uniforms", example: 1800.50 })
    @IsOptional()
    @IsNumber()
    uniforms?: number;

    @ApiProperty({ description: "The amount of money spent on others", example: 1900.50 })
    @IsOptional()
    @IsNumber()
    others?: number;
}

export class ExpenditureDto {
    @ApiProperty({ description: "The month of the expenditure", example: 1 })
    @IsNotEmpty({ message: "El mes es obligatorio" })
    @IsNumber()
    month: number;

    @ApiProperty({ description: "The year of the expenditure", example: 2021 })
    @IsNotEmpty({ message: "El año es obligatorio" })
    @IsNumber()
    year: number;

    @ApiProperty({ description: "All of the data of the expenditure" })
    @IsNotEmpty({ message: "Los datos del egreso son obligatorios" })
    @IsObject()
    @ValidateNested() 
    @Type(() => ExpenditureDataDto)
    data: ExpenditureDataDto;
}