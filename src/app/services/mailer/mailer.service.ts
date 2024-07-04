import { Injectable } from "@nestjs/common";
import { MailerService as NestMailerService } from "@nestjs-modules/mailer";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@Injectable()
export class MailerService {
    constructor(
        @InjectQueue("mail") 
        private readonly mailQueue: Queue,
        private readonly mailerService: NestMailerService, 
    ) {}

    async sendMail(to: string, subject: string, template: string, context: any) {
        await this.mailerService.sendMail({
            to,
            subject,
            template,
            context,
        })
    }

    async addMailJob(to: string, subject: string, template: string, context: any, delay: number = 0) {
        await this.mailQueue.add(
            "send-mail", 
            { to, subject, template, context },
            { delay }
        );
    }
}