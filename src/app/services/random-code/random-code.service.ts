import { Injectable } from '@nestjs/common';
import * as crytpo from 'crypto';

@Injectable()
export class RandomCodeService {
    generateRandomCode(length: number): string {
        return crytpo.randomBytes(length).toString('hex').slice(0, length);
    }
}