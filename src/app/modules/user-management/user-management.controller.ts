import { Controller, Get } from "@nestjs/common";
import { UsersService } from "../users/users.service";

@Controller("user-management")
export class UserManagementController {
    constructor(private readonly usersService: UsersService) {}

    @Get("users")
    getUsers() {}
}
