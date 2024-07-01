import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/app/entities/user.entity";
import { UsersService } from "src/app/modules/users/users.service";
import * as bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiResponse } from "src/app/interfaces/api-response.interface";
import { JwtPayload } from "src/app/interfaces/jwt-payload.interface";
import { SignedUrlService } from "src/app/services/signed-url/signed-url.service";
import { MailerService } from "src/app/services/mailer/mailer.service";
import { MailConstants } from "src/constants/mail-constants";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private readonly signedUrlService: SignedUrlService,
        private readonly mailerService: MailerService,
        private jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async validateUser(email: string, pass: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            return null;
        }

        const isValid = await user.comparePassword(pass);

        return isValid ? user : null;
    }
    async generateToken(user: User) {
        const payload: JwtPayload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(data: registerData): Promise<ApiResponse<User>> {
        const { email, password, phone, passwordConfirmation, ...rest } = data;

        const existingUserByEmail = await this.userRepository.findOneBy({
            email,
        });

        if (existingUserByEmail) {
            throw new BadRequestException(
                "El correo electrónico ya se encuentra en uso.",
            );
        }

        if (password !== passwordConfirmation) {
            throw new BadRequestException("Las contraseñas no coinciden.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            phoneNumber: phone,
            ...rest,
        });

        const newUser = await this.userRepository.save(user);

        if (newUser) {
            const emailUrl = this.signedUrlService.createSignedUrl(
                MailConstants.EndpointVerifyEmail,
                {
                    sub: newUser.id,
                    email: newUser.email,
                    type: "email-verification",
                },
            );
            const phoneUrl = this.signedUrlService.createSignedUrl(
                MailConstants.EndpointVerifyPhone,
                {
                    sub: newUser.id,
                    phone: newUser.phoneNumber,
                    type: "phone-verification",
                },
            );

            await this.mailerService.sendMail(
                newUser.email,
                MailConstants.SubjectVerificationMail,
                "verify-email",
                { url: emailUrl },
            );

            return {
                statusCode: 201,
                message: "Usuario registrado correctamente.",
                data: newUser,
                url: phoneUrl,
            };
        }
    }
}

interface registerData {
    name: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    passwordConfirmation: string;
}
