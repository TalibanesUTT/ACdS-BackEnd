import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Put,
} from "@nestjs/common";
import { SignedUrlService } from "src/app/services/signed-url/signed-url.service";
import { UserManagementService } from "./user-management.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("user-management")
export class UserManagementController {
    constructor(
        private readonly service: UserManagementService,
        private readonly signedURLService: SignedUrlService,
    ) {}

    @Get("users")
    async getUsers() {
        // Retrieve all users
        const users = await this.service.getUsers();

        // Generate and attach signed URLs for each user
        const usersWithSignedUrls = await Promise.all(
            users.map(async (user) => ({
                ...user,
                updateURL: this.signedURLService.createSignedUrl(
                    `user-management/users/${user.id}`,
                    {
                        sub: user.id,
                    },
                ),
            })),
        );

        return usersWithSignedUrls;
    }

    @Put(":id")
    async updateUser(
        @Param("id", ParseIntPipe) id: number,
        @Body() updatedData: UpdateUserDto,
    ) {
        // Update user
        const updatedUser = await this.service.updateUser(id, updatedData);

        // Generate and attach signed URL for the updated user
        const updatedUserWithSignedUrl = {
            ...updatedUser, // Spread user properties
        };

        return {
            message: "Usuario actualizado",
            user: updatedUserWithSignedUrl,
        };
    }
}
