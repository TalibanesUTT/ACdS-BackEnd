import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CustomConfigService {
    constructor(private configService: ConfigService) {}

    get appUrl(): string {
        return this.configService.get<string>('APP_URL');
    }

    get databaseHost(): string {
        return this.configService.get<string>('DATABASE_HOST');
    }

    get databasePort(): number {
        return this.configService.get<number>('DATABASE_PORT');
    }

    get databaseUser(): string {
        return this.configService.get<string>('DATABASE_USER');
    }

    get databasePassword(): string {
        return this.configService.get<string>('DATABASE_PASSWORD');
    }

    get databaseName(): string {
        return this.configService.get<string>('DATABASE_NAME');
    }

    get jwtSecret(): string {
        return this.configService.get<string>('JWT_SECRET_KEY');
    }

    get mailHost(): string {
        return this.configService.get<string>('MAIL_HOST');
    }

    get mailPort(): number {
        return this.configService.get<number>('MAIL_PORT');
    }

    get mailUser(): string {
        return this.configService.get<string>('MAIL_USERNAME');
    }

    get mailPassword(): string {
        return this.configService.get<string>('MAIL_PASSWORD');
    }

    get mailFrom(): string {
        return this.configService.get<string>('MAIL_FROM');
    }
}
