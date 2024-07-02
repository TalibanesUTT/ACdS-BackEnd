import { Controller, Get, Query, HttpException, HttpStatus, Req, Res, Inject, forwardRef } from "@nestjs/common";
import { MailConstants } from "src/constants/mail-constants";
import { Request } from "express";
import { SignedUrlService } from "./signed-url.service";
import { UsersService } from "src/app/modules/users/users.service";
import { User } from "src/app/entities/user.entity";
import * as bcrypt from "bcrypt";
import { Response } from "express";
import { AuthService } from "src/app/modules/auth/auth.service";

@Controller("signed-url")
export class SignedUrlController {
    constructor(
        private readonly signedUrlService: SignedUrlService,
        private readonly usersService: UsersService,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
    ) {}

    @Get("verify/:action")
    async verifySignedUrl(
        @Req() request: Request,
        @Query("token") token: string,
        @Query("code") code: string,
        @Res() res: Response,
    ) {
        const payload = this.signedUrlService.verifySignedUrl(token);
        const action = request.params.action;

        if (!payload) {
            throw new HttpException(
                "Token inválido o expirado",
                HttpStatus.BAD_REQUEST,
            );
        }

        const userId = payload.sub;
        const user = await this.usersService.find(userId);

        switch (action) {
            case MailConstants.EndpointVerifyEmail:
                await this.verifyEmail(user, res);
                break;
            case MailConstants.EndpointVerifyPhone:
                await this.verifyPhone(user, code, res);
                break;
            case MailConstants.EndpointMultiFactor:
                await this.multiFactorAuth(user, code, res);
                break;
            default:
                throw new HttpException(
                    "Acción inválida",
                    HttpStatus.BAD_REQUEST,
                );
        }
    }

    async verifyEmail(user: User, @Res() res: Response) {
        if (!user.phoneConfirmed) {
            this.authService.sendVerificationCode(user);
        } else {
            user.active = true;
        }

        user.emailConfirmed = true;
        await this.usersService.save(user);

        return res.render("success-verification");
    }

    async verifyPhone(user: User, code: string, @Res() res: Response) {
        if (!code || code.length !== 6) {
            throw new HttpException("Código inválido", HttpStatus.BAD_REQUEST);
        }

        const isValid = await bcrypt.compare(code, user.verificationCode);
        if (!isValid) {
            throw new HttpException(
                "Código de verificación incorrecto",
                HttpStatus.BAD_REQUEST,
            );
        }

        user.phoneConfirmed = true;
        user.verificationCode = null;
        if (user.emailConfirmed) {
            user.active = true;
        }

        await this.usersService.save(user);

        return res.json({ message: "Teléfono verificado correctamente" });
    }

    async multiFactorAuth(user: User, code: string, @Res() res: Response) {
        if (!code || code.length !== 6) {
            throw new HttpException("Código inválido", HttpStatus.BAD_REQUEST);
        }

        const isValid = await bcrypt.compare(code, user.verificationCode);
        if (!isValid) {
            throw new HttpException(
                "Código de verificación incorrecto",
                HttpStatus.BAD_REQUEST,
            );
        }

        user.verificationCode = null;
        await this.usersService.save(user);
        const token = await this.authService.generateToken(user);

        return res.json({ 
            message: "Autenticación de dos factores exitosa",
            token: token.access_token,
         });
        
    }
}
