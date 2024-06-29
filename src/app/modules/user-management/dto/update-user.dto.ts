import { ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsOptional,
    IsString,
    IsEmail,
    IsBoolean,
    IsDateString,
    IsEnum,
} from "class-validator";
import { RoleEnum } from "src/app/entities/role.entity";

export class UpdateUserDto {
    @ApiPropertyOptional({
        description: "The name of the user",
        example: "John",
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        description: "The last name of the user",
        example: "Doe",
    })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiPropertyOptional({
        description: "The email of the user",
        example: "john.doe@example.com",
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({
        description: "The phone number of the user",
        example: "+1234567890",
    })
    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @ApiPropertyOptional({
        description: "The password of the user",
        example: "securepassword",
    })
    @IsOptional()
    @IsString()
    password?: string;

    @ApiPropertyOptional({
        description: "The verification code of the user",
        example: "123456",
    })
    @IsOptional()
    @IsString()
    verificationCode?: string;

    @ApiPropertyOptional({
        description: "Is the email confirmed?",
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    emailConfirmed?: boolean;

    @ApiPropertyOptional({
        description: "Is the phone confirmed?",
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    phoneConfirmed?: boolean;

    @ApiPropertyOptional({ description: "Is the user active?", example: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @ApiPropertyOptional({
        description: "The creation date of the user",
        example: "2023-06-28T00:00:00.000Z",
    })
    @IsOptional()
    @IsDateString()
    createDate?: Date;

    @ApiPropertyOptional({
        description: "The role of the user",
        enum: RoleEnum,
        example: RoleEnum.ADMIN,
    })
    @IsOptional()
    @IsEnum(RoleEnum)
    role?: RoleEnum; // Assuming role is referenced by ID
}
