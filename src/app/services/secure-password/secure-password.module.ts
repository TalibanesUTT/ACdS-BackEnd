import { Module } from "@nestjs/common";
import { SecurePasswordService } from "./secure-password.service";

@Module({
    imports: [],
    controllers: [],
    providers: [SecurePasswordService],
    exports: [SecurePasswordService],
})
export class SecurePasswordModule {}