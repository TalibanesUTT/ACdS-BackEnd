import { Body, Controller, Get, Param, ParseIntPipe, Put, UseGuards, Post} from "@nestjs/common";
import { SignedUrlService } from "src/app/services/signed-url/signed-url.service";
import { UserManagementService } from "./user-management.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { RoleEnum } from "src/app/entities/role.entity";
import { Roles } from "src/config/roles.decorator";
import { ApiBearerAuth, ApiBody, ApiQuery } from "@nestjs/swagger";
import { SignedUrlGuard } from "src/common/signed.guard";

@Controller("user-management")
export class UserManagementController {
    constructor(
        private readonly service: UserManagementService,
        private readonly signedURLService: SignedUrlService,
    ) {}

    @Get("users")
    @ApiBearerAuth()
    @Roles(RoleEnum.ROOT)
    async getUsers() {
        // Retrieve all users
        const users = await this.service.getUsers();

        // Generate and attach signed URLs for each user
        const usersWithSignedUrls = await Promise.all(
            users.map(async (user) => ({
                ...user,
                updateURL: this.signedURLService.signExistingUrl(
                    `user-management/${user.id}`,
                    {
                        sub: user.id,
                    },
                ),
            })),
        );

        return usersWithSignedUrls;
    }

    @Put(":id")
    @ApiBearerAuth()
    @ApiQuery({ name: "token", type: String, required: true })
    @Roles(RoleEnum.ROOT)
    @UseGuards(SignedUrlGuard)
    async updateUser(
        @Param("id", ParseIntPipe) id: number,
        @Body() updatedData: UpdateUserDto,
    ) {
        // Update user
        const updatedUser = await this.service.updateUser(id, updatedData);
        return {
            message: "Usuario actualizado",
            user: updatedUser,
        };
    }

    @Post("recoverPassword")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                email: { type: "string", example: "juan.perez@example.com" },
                fromAdmin: { type: "boolean", example: true },
            },
        },
    })
    async recoverPassword(@Body() req: { email: string, fromAdmin: boolean}) {
        return this.service.recoverPassword(req.email, req.fromAdmin);
    }
}
