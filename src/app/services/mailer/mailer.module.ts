import { Module } from "@nestjs/common";
import { MailerModule as NestMailerModule } from "@nestjs-modules/mailer";
import { CustomConfigModule } from "src/config/custom-config.module";
import { CustomConfigService } from "src/config/custom-config.service";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailerService } from "./mailer.service";
import { join } from "path";

@Module({
    imports: [
        NestMailerModule.forRootAsync({
            imports: [CustomConfigModule],
            inject: [CustomConfigService],
            useFactory: async (configService: CustomConfigService) => ({
                transport: {
                    host: configService.mailHost, 
                    port: configService.mailPort,
                    auth: {
                        user: configService.mailUser,
                        pass: configService.mailPassword,
                    },
                    secure: true,
                },
                defaults: {
                    from: configService.mailFrom,
                },
                template: {
                    dir: join(__dirname, '..', '..', 'resources', 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
    ],
    providers: [MailerService],
    exports: [MailerService],
})

export class MailerModule {}