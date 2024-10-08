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
    BadRequestException,
    Query
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
import { HttpService } from "@nestjs/axios";
import { CustomConfigService } from "src/config/custom-config.service";
import { firstValueFrom } from "rxjs";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly httpService: HttpService,
        private readonly customConfigService: CustomConfigService
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
    async login(@Request() req) {
        const user = req.user;

        if (this.authService.requireMultiFactorAuth(user)) {
            return await this.authService.sendMultiFactorAuthEmail(user);
        } else if (this.authService.requirePhoneVerification(user)) {
            const appUrl = this.customConfigService.appUrl;
            const response = await firstValueFrom(this.httpService.get(`${appUrl}/auth/resendVerificationCode/${user.id}`))
            return response.data;
        } else {
            return this.authService.generateToken(user);
        }
    }

    @Post("register")
    @HttpCode(201)
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
    async logout(@Req() req): Promise<ApiResponse<string>> {
        const token = req.headers.authorization.split(" ")[1];
        return await this.authService.logout(token);
    }

    @Get("resendEmailVerification")
    @HttpCode(200)
    async resendEmailVerification(
        @Query('isNewUser') isNewUser: string,
        @Query('fromAdmin') fromAdmin: string,
        @Query('password') password: string,
        @Query('userId') userId: string,
        @Res() res: Response
    ) {
        const isNewUserBool = isNewUser === "true";
        const fromAdminBool = fromAdmin === "true";
        const decodedPassword = password === 'no' ? null : Buffer.from(password, 'base64').toString('utf-8');
  
        const user = await this.usersService.find(parseInt(userId));
        await this.authService.sendEmailVerification(user, isNewUserBool, fromAdminBool, decodedPassword);

        return res.render("new-email-verification");
    }

    @Get("resendVerificationCode/:userId")
    @HttpCode(200)
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
