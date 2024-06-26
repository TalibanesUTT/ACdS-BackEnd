import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength, IsEmail, Matches, MaxLength } from "class-validator";
//import { IsUnique } from "src/validators/unique.validator";

export class RegisterDto {
    @ApiProperty({ description: "Los nombres del usuario", example: "Juan" })
    @IsNotEmpty({ message: "El nombre es obligatorio" })
    @MaxLength(60, { message: "El nombre puede contener un máximo de 60 caracteres"})
    name: string;

    @ApiProperty({ description: "Los apellidos del usuario", example: "Pérez" })
    @IsNotEmpty({ message: "El apellido es obligatorio"})
    @MaxLength(60, { message: "El apellido puede contener un máximo de 60 caracteres"})
    lastName: string;

    @ApiProperty({
        description: "La dirección de correo electrónico del usuario",
        example: "juan.perez@example.com",
    })
    @IsNotEmpty({ message: "El correo electrónico es obligatorio"})
    @IsEmail({}, { message: "El correo electrónico no es válido"})
    //@IsUnique('Users', 'email', { message: "El correo electrónico ya se encuentra en uso" })
    @MaxLength(100, { message: "El correo electrónico puede contener un máximo de 100 caracteres"})
    email: string;

    @ApiProperty({
        description: "La contraseña para la cuenta (mínimo 8 caracteres, al menos un número, una minúscula, una mayúscula y un caracter especial)",
        example: "Contraseña123!",
    })
    @IsNotEmpty({ message: "La contraseña es obligatoria"})
    @MinLength(8, { message: "La contraseña debe contener al menos 8 caracteres"})
    @MaxLength(30, { message: "La contraseña puede contener un máximo de 30 caracteres"})
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/, {
        message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial (!@#$%^&*()-+)",
    })
    password: string;

    @ApiProperty({
        description: "Confirmación de la contraseña",
        example: "Contraseña123!",
    })
    @IsNotEmpty({ message: "La confirmación de la contraseña es obligatoria"})
    passwordConfirmation: string;

    @ApiProperty({
        description: "El número de teléfono del usuario",
        example: "1234567890",
    })
    @IsNotEmpty({ message: "El número de teléfono es obligatorio"})
    @MaxLength(10, { message: "El número de teléfono puede contener un máximo de 10 caracteres"})
    phone: string;
}
