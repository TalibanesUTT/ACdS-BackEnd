import { Module } from "@nestjs/common";
import { SignedUrlController } from "./signed-url.controller";
import { SignedUrlService } from "./signed-url.service";
import { CustomConfigModule } from "src/config/custom-config.module";
import { UsersModule } from "src/app/modules/users/users.module";
import { AuthModule } from "src/app/modules/auth/auth.module";
import { forwardRef } from "@nestjs/common";

@Module({
    imports: [
        CustomConfigModule, 
        UsersModule, 
        forwardRef(() => AuthModule)
    ],
    controllers: [SignedUrlController],
    providers: [SignedUrlService],
    exports: [SignedUrlService],
})

export class SignedUrlModule {}