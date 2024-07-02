import { Module } from "@nestjs/common";
import { UserManagementService } from "./user-management.service";
import { UserManagementController } from "./user-management.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/app/entities/user.entity";
import { SignedUrlModule } from "src/app/services/signed-url/signed-url.module";
import { Role } from "src/app/entities/role.entity";
import { JwtModule } from "@nestjs/jwt";
import { CustomConfigModule } from "src/config/custom-config.module";
import { CustomConfigService } from "src/config/custom-config.service";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [CustomConfigModule],
            inject: [CustomConfigService],
            useFactory: async (configService: CustomConfigService) => ({
                secret: configService.jwtSecret,
                signOptions: { expiresIn: "60m" },
            }),
        }),
        TypeOrmModule.forFeature([User, Role]),
        SignedUrlModule,
    ],
    providers: [UserManagementService],
    controllers: [UserManagementController],
})
export class UserManagementModule {}
