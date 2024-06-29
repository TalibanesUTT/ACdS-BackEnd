import { Module } from "@nestjs/common";
import { RandomCodeService } from "./random-code.service";

@Module({
    imports: [],
    controllers: [],
    providers: [RandomCodeService],
    exports: [RandomCodeService],
})

export class RandomCodeModule {}