import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { User } from "src/app/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";
import { Role } from "src/app/entities/role.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SecurePasswordService } from "src/app/services/secure-password/secure-password.service";
import * as bcrypt from "bcrypt";
import { MailerService } from "src/app/services/mailer/mailer.service";
import { MailConstants } from "src/constants/mail-constants";
import { UsersService } from "../users/users.service";
import { AuthService } from "../auth/auth.service";
import { ApiResponse } from "src/app/interfaces/api-response.interface";

@Injectable()
export class UserManagementService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        private readonly securePasswordService: SecurePasswordService,
        private readonly mailerService: MailerService,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) {}

    async getUsers() {
        const users = (await this.userRepository.find()).map((user) =>
            plainToClass(User, user),
        );
        return users;
    }

    async updateUser(id: number, updatedData: UpdateUserDto): Promise<User> {
        try {
            const user = await this.userRepository.findOneOrFail({
                where: { id },
                relations: ["role"],
            });

            const role = await this.roleRepository.findOneBy({
                value: updatedData.role,
            });

            const formattedUser = {
                ...updatedData,
                role,
            };

            // Merge the updated data
            const updatedUser = this.userRepository.merge(user, formattedUser);

            // Save the updated user back to the database
            const finalUser = await this.userRepository.save(updatedUser);

            return plainToClass(User, finalUser);
        } catch (error) {
            Logger.error(error);
            if (error.name === "EntityNotFoundError") {
                throw new NotFoundException("Usuario no encontrado");
            } else {
                throw new BadRequestException("Datos invalidos");
            }
        }
    }

    async updateProfile(user: User, updatedData: UpdateUserDto): Promise<ApiResponse<User>> {
            var emailHasChanged = false, phoneNumberHasChanged = false;
            var url = null;

            if (!user) {
                throw new NotFoundException("Usuario no encontrado");
            }

            const { email, phoneNumber, role, ...rest } = updatedData;

            if (email && email !== user.email) {
                const existingUserByEmail = !!(await this.usersService.findByEmail(email));

                if (existingUserByEmail) {
                    throw new BadRequestException("El correo electrónico ya se encuentra en uso");
                }

                user.active = false;
                user.emailConfirmed = false;
                emailHasChanged = true;
            }

            if (phoneNumber && phoneNumber !== user.phoneNumber) {
                user.active = false;
                user.phoneConfirmed = false;
                phoneNumberHasChanged = true;
            }

            const updatedUser = this.userRepository.merge(user, { ...rest, email, phoneNumber });
            const finalUser = await this.userRepository.save(updatedUser);

            if (emailHasChanged) {
                this.authService.sendEmailVerification(finalUser, false);
            }

            if (phoneNumberHasChanged) {
                url = this.authService.createPhoneSignedUrl(finalUser);

                if (!emailHasChanged) {
                    this.authService.sendVerificationCode(finalUser);
                }
            }

            return {
                status: 200,
                message: "Perfil actualizado correctamente",
                data: finalUser,
                url: url,
            };

    }

    async recoverPassword(email: string, fromAdmin = false): Promise<ApiResponse<string>> {
        if (!email) {
            throw new BadRequestException("El correo electrónico es obligatorio");
        }

        const user = await this.userRepository.findOneBy({ email });

        if (!user || !user.active || !user.emailConfirmed || !user.phoneConfirmed) {
            throw new NotFoundException("No existe ningún usuario activo con el correo electrónico proporcionado");
        }

        const newPassword = this.securePasswordService.generateSecurePassword(10);
        user.password = await bcrypt.hash(newPassword, 10);
        await this.userRepository.save(user);
        
        await this.mailerService.addMailJob(
            user.email,
            MailConstants.SubjectRecoverPasswordMail,
            "recover-password",
            { password: newPassword, name: user.name, fromAdmin: fromAdmin },
            10000,
        );

        return {
            status: 200,
            message: "Correo de recuperación de contraseña enviado correctamente",
            data: null
        };
    }

    async updatePassword(user: User, actualPassword: string, newPassword: string, passwordConfirmation: string): Promise<ApiResponse<string>> {
        if (newPassword !== passwordConfirmation) {
            throw new BadRequestException("Las contraseñas no coinciden");
        }

        const isPasswordValid = await bcrypt.compare(actualPassword, user.password);

        if (!isPasswordValid) {
            throw new BadRequestException("La contraseña actual es incorrecta");
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await this.userRepository.save(user);

        return {
            status: 200,
            message: "Contraseña actualizada correctamente",
            data: null,
        };
    }
}
