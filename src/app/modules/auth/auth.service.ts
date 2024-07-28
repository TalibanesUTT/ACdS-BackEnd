import {
    BadRequestException,
    Injectable,
    Inject,
    forwardRef,
} from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

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
import { CustomConfigService } from "src/config/custom-config.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => SignedUrlService))
        private readonly signedUrlService: SignedUrlService,
        private readonly mailerService: MailerService,
        private readonly randomCodeService: RandomCodeService,
        private readonly vonageService: VonageService,
        private readonly customConfigService: CustomConfigService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private jwtService: JwtService,
        private usersService: UsersService,
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

    async generateToken(user: User): Promise<ApiResponse<string>> {
        const jti = uuidv4();
        const payload: JwtPayload = {
            email: user.email,
            sub: user.id,
            jti: jti,
        };
        const token = this.jwtService.sign(payload);

        this.whitelistToken(jti);
        return {
            status: 200,
            message: "Sesión iniciada correctamente.",
            data: token,
        };
    }

    requireMultiFactorAuth(user: User): boolean {
        return (
            user.role.value === RoleEnum.ADMIN ||
            user.role.value === RoleEnum.ROOT
        );
    }

    requirePhoneVerification(user: User): boolean {
        return user.role.value === RoleEnum.CUSTOMER && !user.phoneConfirmed && user.changedByAdmin;
    }

    async sendMultiFactorAuthEmail(user: User): Promise<ApiResponse<User>> {
        const verificationCode = this.randomCodeService.generateRandomCode(6);
        user.verificationCode = await bcrypt.hash(verificationCode, 10);
        await this.userRepository.save(user);
        const codeArray = verificationCode.split("");

        const emailUrl = this.signedUrlService.createSignedUrl(
            MailConstants.EndpointMultiFactor,
            { sub: user.id, email: user.email, type: "multi-factor-auth" },
        );

        await this.mailerService.addMailJob(
            user.email,
            MailConstants.SubjectMultiFactorAuthMail,
            "multi-factor-auth",
            { code: codeArray },
            10000,
        );

        return {
            status: 200,
            message: "Correo de verificación enviado correctamente.",
            data: user,
            url: emailUrl,
        };
    }

    async logout(token: string): Promise<ApiResponse<string>> {
        const payload = this.jwtService.decode(token) as JwtPayload;
        await this.blacklistToken(payload.jti);

        return {
            status: 200,
            message: "Sesión cerrada correctamente.",
            data: null,
        };
    }

    async register(data: registerData): Promise<ApiResponse<User>> {
        const { email, password, phone, passwordConfirmation, ...rest } = data;

        const existingUserByEmail =
            !!(await this.usersService.findByEmail(email));

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
            this.sendEmailVerification(newUser, true, false);
            const phoneUrl = this.createPhoneSignedUrl(newUser);

            return {
                status: 201,
                message: "Usuario registrado correctamente.",
                data: newUser,
                url: phoneUrl,
            };
        }
    }

    async sendEmailVerification(user: User, isNewUser: boolean = true, fromAdmin: boolean = false, password?: string) {
        password = password || 'no';
        const subject = isNewUser ? MailConstants.SubjectWelcomeMail : MailConstants.SubjectVerificationMail;
        const resendUrl =
            this.customConfigService.appUrl +
            "/auth/resendEmailVerification/" +
            isNewUser + "/" + fromAdmin + "/" + password + "/" +
            user.id;
        const emailUrl = this.signedUrlService.createSignedUrl(
            MailConstants.EndpointVerifyEmail,
            { sub: user.id, email: user.email, type: "email-verification", isNewUser: isNewUser, fromAdmin: fromAdmin },
        );

        await this.mailerService.addMailJob(
            user.email,
            subject,
            "verify-email",
            { url: emailUrl, name: user.name, resendUrl: resendUrl, isNewUser: isNewUser, fromAdmin: fromAdmin, password: password },
            10000,
        );
    }

    createPhoneSignedUrl(user: User): string {
        const phoneUrl = this.signedUrlService.createSignedUrl(
            MailConstants.EndpointVerifyPhone,
            {
                sub: user.id,
                phone: user.phoneNumber,
                type: "phone-verification",
            },
        );

        return phoneUrl;
    }

    async sendVerificationCode(user: User) {
        const verificationCode = this.randomCodeService.generateRandomCode(6);
        user.verificationCode = await bcrypt.hash(verificationCode, 10);

        const text =
            TextConstants.TextVerificationCodeMessage + verificationCode;
        await this.vonageService.addSmsJob(user.phoneNumber, text, 12000);
        await this.userRepository.save(user);
    }

    async whitelistToken(token: string): Promise<void> {
        await this.cacheManager.set(token, "true");
    }

    async blacklistToken(token: string): Promise<void> {
        await this.cacheManager.del(token);
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
