import { Controller, Get, Query, UseGuards, HttpException, HttpStatus, Req } from "@nestjs/common";
import { MailConstants } from "src/constants/mail-constants";
import { Request } from "express";
import { SignedUrlService } from "./signed-url.service";
import { UsersService } from "src/app/modules/users/users.service";
import { User } from "src/app/entities/user.entity";
import { RandomCodeService } from "../random-code/random-code.service";

@Controller("signed-url")
export class SignedUrlController {
    constructor(
        private readonly signedUrlService: SignedUrlService,
        private readonly usersService: UsersService,
        private readonly randomCodeService: RandomCodeService,
    ) {}

    @Get("verify/:action")
    async verifySignedUrl(@Req() request: Request, @Query("token") token: string) {
        const payload = this.signedUrlService.verifySignedUrl(token);
        const action = request.params.action;

        if (!payload) {
            throw new HttpException("Token inválido o expirado", HttpStatus.BAD_REQUEST);
        }

        const userId = payload.sub;
        const user = await this.usersService.find(userId);

        switch (action) {
            case MailConstants.EndpointVerifyEmail:
                this.verifyEmail(user);
                break;
            default: 
                throw new HttpException("Acción inválida", HttpStatus.BAD_REQUEST);
        }
        
    }

    private verifyEmail(user: User) {
        console.log(user);
        if (user.phoneConfirmed === false) {
            console.log("Email verified");
        }
            
        const verificationCode = this.randomCodeService.generateRandomCode(6);
    }
}