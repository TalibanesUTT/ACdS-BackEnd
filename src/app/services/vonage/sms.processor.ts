import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { VonageService } from "./vonage.service";

@Processor("sms")
export class SmsProcessor extends WorkerHost {
    constructor(private readonly vonageService: VonageService) {
        super();
    }

    async process(job: Job<any>) {
        const { to, text } = job.data;
        await this.vonageService.sendSms(to, text);
    }
}