import { Controller, Get, HttpCode } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiResponse } from "src/app/interfaces/api-response.interface";
import { User } from "src/app/entities/user.entity";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "src/config/roles.decorator";
import { RoleEnum } from "src/app/entities/role.entity";

@Controller("users")
@ApiTags("users")
export class UsersController { 
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Get()
    @HttpCode(200)
    @Roles(RoleEnum.ADMIN, RoleEnum.ROOT)
    async getUsers(): Promise<ApiResponse<User[]>> {
        const users = await this.usersService.findAll();
        return { 
            status: 200,
            message: null,
            data: users
         };
    }
}