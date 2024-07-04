import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/app/entities/user.entity";
import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtPayload } from "src/app/interfaces/jwt-payload.interface";
import { CustomConfigService } from "src/config/custom-config.service";

export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: CustomConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.jwtSecret
        });
    }

    async validate(payload: JwtPayload): Promise<User | null> {
        try {
            const user = await this.userRepository.findOneByOrFail({
                id: payload.sub,
            });

            if (!user.active || !user.emailConfirmed || !user.phoneConfirmed) {
                return null;
            }
            return user;
        } catch (error) {
            this.logger.error(error.message);
            return null;
        }
    }
}
