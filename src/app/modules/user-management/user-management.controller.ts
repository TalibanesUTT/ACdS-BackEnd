import { Body, Controller, Get, Param, ParseIntPipe, Put, Post, UseGuards, HttpCode } from "@nestjs/common";
import { SignedUrlService } from "src/app/services/signed-url/signed-url.service";
import { UserManagementService } from "./user-management.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { RoleEnum } from "src/app/entities/role.entity";
import { Roles } from "src/config/roles.decorator";
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "src/app/interfaces/api-response.interface";
import { User } from "src/app/entities/user.entity";
import { GetUser } from "src/config/user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { SignedUrlGuard } from "src/common/signed.guard";

@Controller("user-management")
@ApiTags("user-management")
export class UserManagementController {
    constructor(
        private readonly service: UserManagementService,
        private readonly signedURLService: SignedUrlService,
    ) {}

    @Get("users")
    @ApiBearerAuth()
    @Roles(RoleEnum.ROOT)
    @HttpCode(200)
    async getUsers(): Promise<ApiResponse<object[]>> {
        const users = await this.service.getUsers();
        const usersWithSignedUrls = await Promise.all(
            users.map(async (user) => ({
                ...user,
                updateURL: this.signedURLService.signExistingUrl(
                    `user-management/${user.id}`,
                    { sub: user.id },
                ),
            })),
        );

        return { 
            status: 200, 
            message: null, 
            data: usersWithSignedUrls 
        };
    }

    @Put(":id")
    @ApiBearerAuth()
    @ApiQuery({ name: "token", type: String, required: true })
    @HttpCode(200)
    @Roles(RoleEnum.ROOT)
    @UseGuards(SignedUrlGuard)
    async updateUser(
        @Param("id", ParseIntPipe) id: number,
        @Body() updatedData: UpdateUserDto,
    ): Promise<ApiResponse<User>> {
        const updatedUser = await this.service.updateUser(id, updatedData);
        return { 
            status: 200, 
            message: "Usuario actualizado correctamente", 
            data: updatedUser 
        };
    }

    @Put("updateProfile/:id")
    @ApiBearerAuth()
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async updateProfile(
        @GetUser() user: User,
        @Body() updatedData: UpdateUserDto,
    ) {
        return this.service.updateProfile(user, updatedData);
    }

    @Post("recoverPassword")
    @HttpCode(200)
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                email: { type: "string", example: "juan.perez@example.com" },
                fromAdmin: { type: "boolean", example: true },
            },
        },
    })
    async recoverPassword(@Body() req: { email: string, fromAdmin: boolean }) {
        return this.service.recoverPassword(req.email, req.fromAdmin);
    }

    @Put("updatePassword/:id")
    @HttpCode(200)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                actualPassword: { type: "string", example: "password" },
                newPassword: { type: "string", example: "newPassword" },
                passwordConfirmation: { type: "string", example: "newPassword" },
            },
        },
    })
    async updatePassword(
        @GetUser() user: User,
        @Body() req: { actualPassword: string, newPassword: string, passwordConfirmation: string },
    ) {
        return this.service.updatePassword(user, req.actualPassword, req.newPassword, req.passwordConfirmation);
    }
}