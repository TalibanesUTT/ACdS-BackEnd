import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength, IsEmail, Matches } from "class-validator";

export class RegisterDto {
    @ApiProperty({ description: "El nombre del usuario", example: "Juan" })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: "El apellido del usuario", example: "Pérez" })
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        description: "La dirección de correo electrónico del usuario",
        example: "juan.perez@example.com",
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description:
            "La contraseña para la cuenta (mínimo 8 caracteres, al menos un número)",
        example: "Contraseña123!",
    })
    @IsNotEmpty()
    @MinLength(8)
    @Matches(/^(?=.*\d)/, {
        message: "La contraseña debe contener al menos un número",
    })
    password: string;

    @ApiProperty({
        description: "Confirmación de la contraseña",
        example: "Contraseña123!",
    })
    @IsNotEmpty()
    passwordConfirmation: string;

    @ApiProperty({
        description: "El número de teléfono del usuario",
        example: "1234567890",
    })
    @IsNotEmpty()
    phone: string;
}
