import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/app/modules/users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { AuthController } from "./auth.controller";
import { User } from "src/app/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SignedUrlModule } from "src/app/services/signed-url/signed-url.module";
import { MailerModule } from "src/app/services/mailer/mailer.module";
import { VonageModule } from "src/app/services/vonage/vonage.module";
import { RandomCodeModule } from "src/app/services/random-code/random-code.module";
import { forwardRef } from "@nestjs/common";
import { CustomConfigModule } from "src/config/custom-config.module";
import { CustomConfigService } from "src/config/custom-config.service";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
import type { RedisClientOptions } from "redis";
import { redisStore } from "cache-manager-redis-store";
import { RedisStoreProxy } from "src/config/redis-store-proxy";

@Module({
    imports: [
        UsersModule,
        ConfigModule.forRoot({ isGlobal: true }),

        PassportModule,
        CustomConfigModule,
        CacheModule.registerAsync<RedisClientOptions>({
            imports: [CustomConfigModule],
            inject: [CustomConfigService],
            useFactory: async (configService: CustomConfigService) => {
                const redisStoreInstance = await redisStore({
                    url: `redis://${configService.redisHost}:${configService.redisPort}`,
                });

                return {
                    store: new RedisStoreProxy(redisStoreInstance),
                };
            },
        }),
        forwardRef(() => SignedUrlModule),
        MailerModule,
        VonageModule,
        RandomCodeModule,
        JwtModule.registerAsync({
            imports: [CustomConfigModule],
            inject: [CustomConfigService],
            useFactory: async (configService: CustomConfigService) => ({
                secret: configService.jwtSecret,
            }),
        }),
        TypeOrmModule.forFeature([User]),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
