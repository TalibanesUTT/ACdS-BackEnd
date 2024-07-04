import { Module } from "@nestjs/common";
import { CustomConfigModule } from "src/config/custom-config.module";
import { VonageService } from "./vonage.service";
import { BullModule } from "@nestjs/bullmq";
import { SmsProcessor } from "./sms.processor";

@Module({
    imports: [
        CustomConfigModule,
        BullModule.registerQueue({
            name: "sms",
        }),
    ],
    controllers: [],
    providers: [SmsProcessor, VonageService],
    exports: [VonageService, BullModule],
})

export class VonageModule {}