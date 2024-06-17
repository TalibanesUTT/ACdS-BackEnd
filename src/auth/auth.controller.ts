import { Request, Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly service: AuthService) {}

    @UseGuards(AuthGuard("local"))
    @Post("login")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async login(@Request() req) {
        return this.service.generateToken(req.user);
    }

    @Post("register")
    async register(@Body() req: RegisterDto) {
        return this.service.register(req);
    }
}
