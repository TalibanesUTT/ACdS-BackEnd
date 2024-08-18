import { ValidateStatus } from "@/config/validate-status.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

export class StatusDto {
    @ApiProperty({ description: "The notes about the status", example: "The vehicle is in good condition" })
    @IsOptional()
    @IsString()
    @MaxLength(255, { message: "Las notas pueden contener un máximo de 255 caracteres" })
    comments?: string;

    @ApiProperty({ description: "Is it a rollback?", example: false, default: false })
    @IsOptional()
    @IsBoolean()
    rollback?: boolean;

    @ApiProperty({ description: "The service order will be cancelled?", example: false, default: false })
    @IsOptional()
    @IsBoolean()
    cancel?: boolean;

    @ApiProperty({ description: "The service order will be put on hold?", example: false, default: false })
    @IsOptional()
    @IsBoolean()
    onHold?: boolean;

    @ApiProperty({ description: "The service order will be rejected?", example: false, default: false })
    @IsOptional()
    @IsBoolean()
    reject?: boolean;

    @ValidateStatus({ message: "Solo es posible seleccionar una opción a la vez" })
    validateStatus: boolean;
}