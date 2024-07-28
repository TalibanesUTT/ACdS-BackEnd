import { ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsOptional,
    IsString,
    IsEmail,
    IsBoolean,
    IsEnum,
    MaxLength,
    MinLength,
} from "class-validator";
import { RoleEnum } from "src/app/entities/role.entity";

export class UpdateUserDto {
    @ApiPropertyOptional({
        description: "The name of the user",
        example: "John",
    })
    @IsOptional()
    @IsString()
    @MaxLength(60, {
        message: "El nombre puede contener un máximo de 60 caracteres",
    })
    name?: string;

    @ApiPropertyOptional({
        description: "The last name of the user",
        example: "Doe",
    })
    @IsOptional()
    @IsString()
    @MaxLength(60, {
        message: "El apellido puede contener un máximo de 60 caracteres",
    })
    lastName?: string;

    @ApiPropertyOptional({
        description: "The email of the user",
        example: "john.doe@example.com",
    })
    @IsOptional()
    @IsEmail()
    @MaxLength(100, {
        message:
            "El correo electrónico puede contener un máximo de 100 caracteres",
    })
    email?: string;

    @ApiPropertyOptional({
        description: "The phone number of the user",
        example: "1234567890",
    })
    @IsOptional()
    @IsString()
    @MaxLength(10, {
        message:
            "El número de teléfono puede contener un máximo de 10 caracteres",
    })
    phoneNumber?: string;

    @ApiPropertyOptional({
        description: "The password of the user",
        example: "securepassword",
    })
    @IsOptional()
    @IsString()
    @MinLength(8, {
        message: "La contraseña debe contener al menos 8 caracteres",
    })
    @MaxLength(30, {
        message: "La contraseña puede contener un máximo de 30 caracteres",
    })
    password?: string;

    @ApiPropertyOptional({ description: "Is the user active?", example: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @ApiPropertyOptional({
        description: "The role of the user",
        enum: RoleEnum,
        example: RoleEnum.ADMIN,
    })
    @IsOptional()
    @IsEnum(RoleEnum, {
        message: `Rol inválido, el rol debería ser alguno de los siguientes valores: ${Object.values(
            RoleEnum,
        ).join(", ")}`,
    })
    role?: RoleEnum; // Assuming role is referenced by ID
}
