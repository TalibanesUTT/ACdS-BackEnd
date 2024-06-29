import { Module } from "@nestjs/common";
import { UserManagementService } from "./user-management.service";
import { UserManagementController } from "./user-management.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/app/entities/user.entity";
import { SignedUrlModule } from "src/app/services/signed-url/signed-url.module";

@Module({
    imports: [TypeOrmModule.forFeature([User]), SignedUrlModule],
    providers: [UserManagementService],
    controllers: [UserManagementController],
})
export class UserManagementModule {}
