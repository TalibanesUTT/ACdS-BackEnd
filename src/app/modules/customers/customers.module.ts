import { Module } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/app/entities/user.entity";
import { CustomersController } from "./customers.controller";
import { Role } from "src/app/entities/role.entity";
import { UsersModule } from "../users/users.module";
import { SecurePasswordModule } from "src/app/services/secure-password/secure-password.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role]),
        UsersModule,
        SecurePasswordModule, 
        AuthModule
    ],
    controllers: [CustomersController],
    providers: [CustomersService],
})
export class CustomersModule {}