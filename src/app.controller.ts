import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
// import { ApiBearerAuth, ApiHeader } from "@nestjs/swagger";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get("profile")
    /*    @ApiHeader({
        name: "Authorization",
        description: "Bearer <access_token>",
    }) */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    getProfile(@Request() req: any) {
        return req.user;
    }
}
