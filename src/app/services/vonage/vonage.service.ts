import { Injectable } from "@nestjs/common";
import { Vonage } from "@vonage/server-sdk";
import { CustomConfigService } from "src/config/custom-config.service";

@Injectable()
export class VonageService {
    private vonage: Vonage;

    constructor(private readonly configService: CustomConfigService) {
        this.vonage = new Vonage({
            apiKey: this.configService.vonageApiKey,
            apiSecret: this.configService.vonageApiSecret,
        } as any);
    }

    async sendSms(to: string, text: string): Promise<any> {
        const from = 'ACdS App';
        try {
            to = '52' + to;
            const response = await this.vonage.sms.send({ to, from, text });
            return response;
        } catch (error) {
            throw error;
        }
    }

}