import {
    Request,
    Body,
    Controller,
    Post,
    UseGuards,
    Get,
    Res,
    Req,
    Delete,
    HttpCode,
    BadRequestException
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
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
    @HttpCode(200)
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                email: { type: "string", example: "juan.perez@example.com" },
                password: { type: "string", example: "Contraseña123!" },
            },
        },
    })
    @ApiTags("auth")
    async login(@Request() req) {
        const user = req.user;

        if (this.authService.requireMultiFactorAuth(user)) {
            return await this.authService.sendMultiFactorAuthEmail(user);
        } else {
            return this.authService.generateToken(user);
        }
    }

    @Post("register")
    @HttpCode(201)
    @ApiTags("auth")
    async register(@Body() req: RegisterDto) {
        return this.authService.register(req);
    }

    @Post("existsUser")
    @HttpCode(200)
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                email: { type: "string", example: "juan.perez@example.com" },
            },
        },
    })
    @ApiTags("auth")
    async existsUser(@Body() req: { email: string }): Promise<ApiResponse<boolean>> {
        if (!req.email) {
            throw new BadRequestException("El correo electrónico es requerido");
        }
        const user = !!(await this.usersService.findByEmail(req.email));
        return {
            status: 200,
            message: null,
            data: user,
        };
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete("logout")
    @HttpCode(200)
    @ApiTags("auth")
    async logout(@Req() req): Promise<void> {
        const token = req.headers.authorization.split(" ")[1];
        await this.authService.logout(token);
    }

    @Get("resendEmailVerification/:isNewUser/:userId")
    @HttpCode(200)
    @ApiTags("auth")
    async resendEmailVerification(@Request() req, @Res() res: Response) {
        const userId = req.params.userId;
        const isNewUserBool = req.params.isNewUser === "true";
        const user = await this.usersService.find(userId);
        await this.authService.sendEmailVerification(user, isNewUserBool);

        return res.render("new-email-verification");
    }

    @Get("resendVerificationCode/:userId")
    @HttpCode(200)
    @ApiTags("auth")
    async resendVerificationCode(@Request() req): Promise<ApiResponse<User>> {
        const userId = req.params.userId;
        const user = await this.usersService.find(userId);
        const phoneUrl = this.authService.createPhoneSignedUrl(user);
        await this.authService.sendVerificationCode(user);

        return {
            status: 200,
            message: "Código de verificación reenviado",
            data: user,
            url: phoneUrl,
        };
    }
}
