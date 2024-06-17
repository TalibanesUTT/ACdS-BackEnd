import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { AuthService } from "./auth/auth.service";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
// import { ApiBearerAuth, ApiHeader } from "@nestjs/swagger";

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly authService: AuthService,
    ) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get("profile")
    /*   @ApiHeader({
        name: "Authorization",
        description: "Bearer <access_token>",
    })
    @ApiBearerAuth() */
    @UseGuards(JwtAuthGuard)
    getProfile(@Request() req) {
        return req.user;
    }
}
