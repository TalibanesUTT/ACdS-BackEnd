import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/app/entities/user.entity";
import { Inject, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtPayload } from "src/app/interfaces/jwt-payload.interface";
import { CustomConfigService } from "src/config/custom-config.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: CustomConfigService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.jwtSecret,
        });
    }

    async validate(payload: JwtPayload): Promise<User | null> {
        try {
            const user = await this.userRepository.findOneByOrFail({
                id: payload.sub,
            });
            const token = payload.jti;
            const isWhitelisted = await this.cacheManager.get(token);
            if (!isWhitelisted) {
                return null;
            }

            if (!user.active || !user.emailConfirmed) {
                return null;
            }
            return user;
        } catch (error) {
            this.logger.error(error.message);
            return null;
        }
    }
}
