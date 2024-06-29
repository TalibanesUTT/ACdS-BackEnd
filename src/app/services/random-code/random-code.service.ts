import { Injectable } from '@nestjs/common';
import * as crytpo from 'crypto';

@Injectable()
export class RandomCodeService {
    generateRandomCode(length: number): string {
        const randomBytes = crytpo.randomBytes(length);
        const randomCode = parseInt(randomBytes.toString('hex'), 16).toString().slice(0, length);
        return randomCode;
    }
}