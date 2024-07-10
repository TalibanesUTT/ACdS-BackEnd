import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";

@Injectable()
export class SecurePasswordService {
    private upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
    private numberChars = "0123456789";
    private specialChars = "!@#$%^&*()_+{}[]";

    generateSecurePassword(length: number): string {
        const getRandomChar = (charset: string) => charset[crypto.randomInt(0, charset.length)];

        const passwordChars = [
            getRandomChar(this.upperCaseChars),
            getRandomChar(this.lowerCaseChars),
            getRandomChar(this.numberChars),
            getRandomChar(this.specialChars),
        ];

        const allChars = this.upperCaseChars + this.lowerCaseChars + this.numberChars + this.specialChars;
        for (let i = 4; i < length; i++) {
            passwordChars.push(getRandomChar(allChars));
        }

        for (let i = passwordChars.length - 1; i > 0; i--) {
            const j = crypto.randomInt(0, i + 1);
            [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
        }

        return passwordChars.join("");
    }
}