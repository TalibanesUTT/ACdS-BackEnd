import { Module } from "@nestjs/common";
import { TimezoneDatesService } from "./timezone-dates.service";

@Module({
    providers: [TimezoneDatesService],
    exports: [TimezoneDatesService],
})
export class TimezoneDatesModule {}