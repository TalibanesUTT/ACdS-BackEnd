import { BadRequestException, Injectable, Inject, forwardRef } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/app/entities/user.entity";
import * as bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiResponse } from "src/app/interfaces/api-response.interface";
import { JwtPayload } from "src/app/interfaces/jwt-payload.interface";
import { SignedUrlService } from "src/app/services/signed-url/signed-url.service";
import { MailerService } from "src/app/services/mailer/mailer.service";
import { MailConstants } from "src/constants/mail-constants";
import { RandomCodeService } from "src/app/services/random-code/random-code.service";
import { VonageService } from "src/app/services/vonage/vonage.service";
import { TextConstants } from "src/constants/text-constants";
import { RoleEnum } from "src/app/entities/role.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => SignedUrlService))
        private readonly signedUrlService: SignedUrlService,
        private readonly mailerService: MailerService,
        private readonly randomCodeService: RandomCodeService,
        private readonly vonageService: VonageService,
        private jwtService: JwtService,
        private usersService: UsersService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async validateUser(email: string, pass: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ email });
        if (!user || !user.active || !user.emailConfirmed || !user.phoneConfirmed) {
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

    requireMultiFactorAuth(user: User): boolean {
        return user.role.value === RoleEnum.ADMIN || user.role.value === RoleEnum.ROOT;
    }

    async sendMultiFactorAuthEmail(user: User): Promise<ApiResponse<User>> {
        const verificationCode = this.randomCodeService.generateRandomCode(6);
        user.verificationCode = await bcrypt.hash(verificationCode, 10);
        await this.userRepository.save(user);

        const emailUrl = this.signedUrlService.createSignedUrl(
            MailConstants.EndpointMultiFactor,
            { sub: user.id, email: user.email, type: 'multi-factor-auth' }
        );

        await this.mailerService.sendMail(
            user.email, 
            MailConstants.SubjectMultiFactorAuthMail, 
            'multi-factor-auth', 
            { url: emailUrl, name: user.name, code: verificationCode }
        );

        return {
            statusCode: 200,
            message: "Código de verificación enviado correctamente.",
            data: user,
            url: emailUrl,
        };
    }

    async register(data: registerData): Promise<ApiResponse<User>> {
        const { email, password, phone, passwordConfirmation, ...rest } = data;

        const existingUserByEmail = !!(await this.usersService.findByEmail(email));

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
            this.sendEmailVerification(newUser);
            const phoneUrl = this.createPhoneSignedUrl(newUser);
            
            return {
                statusCode: 201,
                message: "Usuario registrado correctamente.",
                data: newUser,
                url: phoneUrl,
            };
        }
    }

    async sendEmailVerification(user: User) {
        const emailUrl = this.signedUrlService.createSignedUrl(
            MailConstants.EndpointVerifyEmail,
            { sub: user.id, email: user.email, type: 'email-verification'}
        );

        await this.mailerService.sendMail(
            user.email, 
            MailConstants.SubjectVerificationMail, 
            'verify-email', 
            { url: emailUrl, name: user.name, userId: user.id}
        );
    }

    createPhoneSignedUrl(user: User): string {
        const phoneUrl = this.signedUrlService.createSignedUrl(
            MailConstants.EndpointVerifyPhone, 
            { sub: user.id, phone: user.phoneNumber, type: 'phone-verification'}
        );

        return phoneUrl;
    }

    async sendVerificationCode(user: User) {
        const verificationCode = this.randomCodeService.generateRandomCode(6);
        user.verificationCode = await bcrypt.hash(verificationCode, 10);

        const text = TextConstants.TextVerificationCodeMessage + verificationCode;
        await this.vonageService.sendSms(user.phoneNumber, text);
        await this.userRepository.save(user);
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
