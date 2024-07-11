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

@Injectable()
export class UserManagementService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        private readonly securePasswordService: SecurePasswordService,
        private readonly mailerService: MailerService,
    ) {}

    async getUsers() {
        const users = (await this.userRepository.find()).map((user) =>
            plainToClass(User, user),
        );
        return users;
    }

    async updateUser(id: number, updatedData: UpdateUserDto) {
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

    async recoverPassword(email: string, fromAdmin = false) {
        if (!email) {
            throw new BadRequestException("El correo electrónico es obligatorio");
        }

        const user = await this.userRepository.findOneBy({ email });

        if (!user || !user.active || !user.emailConfirmed || !user.phoneConfirmed) {
            throw new NotFoundException("No existe ningún usuario con el correo electrónico proporcionado");
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
            statusCode: 200,
            message: "Correo de recuperación de contraseña enviado correctamente"
        };
    }

    async updatePassword(id: number, actualPassword: string, newPassword: string, passwordConfirmation: string) {
        if (newPassword !== passwordConfirmation) {
            throw new BadRequestException("Las contraseñas no coinciden");
        }

        const user = await this.userRepository.findOneBy({ id });

        const isPasswordValid = await bcrypt.compare(actualPassword, user.password);

        if (!isPasswordValid) {
            throw new BadRequestException("La contraseña actual es incorrecta");
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await this.userRepository.save(user);

        return {
            statusCode: 200,
            message: "Contraseña actualizada correctamente"
        };
    }
}
