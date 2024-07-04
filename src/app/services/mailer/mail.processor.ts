import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from './mailer.service';

@Processor('mail')
export class MailProcessor extends WorkerHost {
    constructor(private readonly mailerService: MailerService) {
        super();
    }

    async process(job: Job<any>) {
        const { to, subject, template, context } = job.data;
        await this.mailerService.sendMail(to, subject, template, context);
    }
}