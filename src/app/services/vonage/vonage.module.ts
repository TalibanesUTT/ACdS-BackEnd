import { Module } from "@nestjs/common";
import { CustomConfigModule } from "src/config/custom-config.module";
import { VonageService } from "./vonage.service";

@Module({
    imports: [CustomConfigModule],
    controllers: [],
    providers: [VonageService],
    exports: [VonageService],
})

export class VonageModule {}