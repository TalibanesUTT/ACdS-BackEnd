import { Controller, Get, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { JwtAuthGuard } from "./app/modules/auth/jwt-auth.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "./config/roles.decorator";
import { RoleEnum } from "./app/entities/role.entity";
import { GetUser } from "./config/user.decorator";
import { User } from "./app/entities/user.entity";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
    @Get("profile")
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    getProfile(@GetUser() user: User) {
        return user;
    }

    @Get("admin")
    @ApiBearerAuth()
    @Roles(RoleEnum.ADMIN)
    getAdmin(@GetUser() user: User) {
        return user;
    }

    @Get("customer")
    @ApiBearerAuth()
    @Roles(RoleEnum.CUSTOMER)
    getCustomer(@GetUser() user: User) {
        return user;
    }
}
