import { Controller, Get, Query, HttpException, HttpStatus, Req, Res } from "@nestjs/common";
import { MailConstants } from "src/constants/mail-constants";
import { Request } from "express";
import { SignedUrlService } from "./signed-url.service";
import { UsersService } from "src/app/modules/users/users.service";
import { User } from "src/app/entities/user.entity";
import { RandomCodeService } from "../random-code/random-code.service";
import * as bcrypt from "bcrypt";
import { VonageService } from "../vonage/vonage.service";
import { TextConstants } from "src/constants/text-constants";
import { Response } from "express";
import { ApiResponse } from "src/app/interfaces/api-response.interface";

@Controller("signed-url")
export class SignedUrlController {
    constructor(
        private readonly signedUrlService: SignedUrlService,
        private readonly usersService: UsersService,
        private readonly randomCodeService: RandomCodeService,
        private readonly vonageService: VonageService,
    ) {}

    @Get("verify/:action")
    async verifySignedUrl(
        @Req() request: Request, 
        @Query("token") token: string,
        @Query("code") code: string,
        @Res() res: Response
    ) {
        const payload = this.signedUrlService.verifySignedUrl(token);
        const action = request.params.action;

        if (!payload) {
            throw new HttpException("Token inválido o expirado", HttpStatus.BAD_REQUEST);
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
            default: 
                throw new HttpException("Acción inválida", HttpStatus.BAD_REQUEST);
        }
        
    }

    async verifyEmail(user: User, @Res() res: Response) {
        if (!user.phoneConfirmed) {
            const verificationCode = this.randomCodeService.generateRandomCode(6);
            user.verificationCode = await bcrypt.hash(verificationCode, 10);

            const text = TextConstants.TextVerificationCodeMessage + verificationCode;
            await this.vonageService.sendSms(user.phoneNumber, text);
        } else {
            user.active = true;
        }

        user.emailConfirmed = true;
        await this.usersService.save(user);

        return res.render("success-verification")
    }

    async verifyPhone(user: User, code: string, @Res() res: Response) {
        if (!code || code.length !== 6) {
            throw new HttpException("Código inválido", HttpStatus.BAD_REQUEST);
        }

        const isValid = await bcrypt.compare(code, user.verificationCode);
        if (!isValid) {
            throw new HttpException("Código de verificación incorrecto", HttpStatus.BAD_REQUEST);
        }

        user.phoneConfirmed = true;
        user.verificationCode = null;
        if (user.emailConfirmed) {
            user.active = true;
        }

        await this.usersService.save(user);
        
        return res.json({ message: "Teléfono verificado correctamente" });
    }
}