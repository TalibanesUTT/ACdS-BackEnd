import { Request, Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { ApiBody } from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
    constructor(private readonly service: AuthService) {}

    @UseGuards(AuthGuard("local"))
    @Post("login")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                email: { type: "string" },
                password: { type: "string" },
            },
        },
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async login(@Request() req) {
        return this.service.generateToken(req.user);
    }

    @Post("register")
    async register(@Body() req: RegisterDto) {
        return this.service.register(req);
    }
}
