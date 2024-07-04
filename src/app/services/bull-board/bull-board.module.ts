import { Module } from "@nestjs/common";
import { BullBoardService } from "./bull-board.service";
import { VonageModule } from "../vonage/vonage.module";
import { MailerModule } from "../mailer/mailer.module";
import { BullBoardController } from "./bull-board.controller";

@Module({
    imports: [VonageModule, MailerModule],
    providers: [BullBoardService],
    controllers: [BullBoardController],
    exports: [BullBoardService],
})
export class BullBoardModule {}