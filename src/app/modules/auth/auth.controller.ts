import {
    Request,
    Body,
    Controller,
    Post,
    UseGuards,
    Get,
    Res,
    Req,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { ApiBody } from "@nestjs/swagger";
import { UsersService } from "../users/users.service";
import { ApiResponse } from "src/app/interfaces/api-response.interface";
import { User } from "src/app/entities/user.entity";
import { Response } from "express";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}

    @UseGuards(AuthGuard("local"))
    @Post("login")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                email: { type: "string", example: "juan.perez@example.com" },
                password: { type: "string", example: "Contraseña123!" },
            },
        },
    })
    async login(@Request() req) {
        const user = req.user;

        if (this.authService.requireMultiFactorAuth(user)) {
            return await this.authService.sendMultiFactorAuthEmail(user);
        } else {
            return this.authService.generateToken(user);
        }
    }

    @Post("register")
    async register(@Body() req: RegisterDto) {
        return this.authService.register(req);
    }

    @Post("existsUser")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                email: { type: "string", example: "juan.perez@example.com" },
            },
        },
    })
    async existsUser(@Body() req: { email: string }): Promise<object> {
        if (!req.email) {
            return {
                exists: false,
            };
        }
        const user = !!(await this.usersService.findByEmail(req.email));
        return {
            exists: user,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Post("logout")
    async logout(@Req() req): Promise<void> {
        const token = req.headers.authorization.split(" ")[1];
        await this.authService.blacklistToken(token);
    }

    @Get("resendEmailVerification/:userId")
    async resendEmailVerification(@Request() req, @Res() res: Response) {
        const userId = req.params.userId;
        const user = await this.usersService.find(userId);
        await this.authService.sendEmailVerification(user);

        return res.render("new-email-verification");
    }

    @Get("resendVerificationCode/:userId")
    async resendVerificationCode(@Request() req): Promise<ApiResponse<User>> {
        const userId = req.params.userId;
        const user = await this.usersService.find(userId);
        const phoneUrl = this.authService.createPhoneSignedUrl(user);
        await this.authService.sendVerificationCode(user);

        return {
            statusCode: 200,
            message: "Código de verificación reenviado",
            data: user,
            url: phoneUrl,
        };
    }
}
