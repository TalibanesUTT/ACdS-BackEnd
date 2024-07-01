import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { CustomConfigService } from "src/config/custom-config.service";
import { JwtPayload } from "src/app/interfaces/jwt-payload.interface";

@Injectable()
export class SignedUrlService {
    private readonly appUrl: string;
    private readonly jwtSecret: string;
    private readonly expirationTime = "1h";

    constructor(private configService: CustomConfigService) {
        this.appUrl = this.configService.appUrl;
        this.jwtSecret = this.configService.jwtSecret;
    }

    createSignedUrl(endpoint: string, payload: JwtPayload): string {
        const token = jwt.sign(payload, this.jwtSecret, {
            expiresIn: this.expirationTime,
        });
        return `${this.appUrl}/signed-url/verify/${endpoint}?token=${token}`;
    }

    signExistingUrl(url: string, payload: JwtPayload): string {
        const token = jwt.sign(payload, this.jwtSecret, {
            expiresIn: this.expirationTime,
        });
        return `${url}?token=${token}`;
    }

    verifySignedUrl(token: string): JwtPayload | null {
        try {
            const payload = jwt.verify(
                token,
                this.jwtSecret,
            ) as unknown as JwtPayload;
            return payload;
        } catch (error) {
            return null;
        }
    }
}
