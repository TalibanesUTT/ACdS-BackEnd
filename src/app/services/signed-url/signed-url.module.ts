import { Module } from "@nestjs/common";
import { SignedUrlController } from "./signed-url.controller";
import { SignedUrlService } from "./signed-url.service";
import { CustomConfigModule } from "src/config/custom-config.module";
import { UsersModule } from "src/app/modules/users/users.module";
import { RandomCodeModule } from "../random-code/random-code.module";
import { VonageModule } from "../vonage/vonage.module";

@Module({
    imports: [
        CustomConfigModule, 
        UsersModule, 
        RandomCodeModule, 
        VonageModule
    ],
    controllers: [SignedUrlController],
    providers: [SignedUrlService],
    exports: [SignedUrlService],
})

export class SignedUrlModule {}