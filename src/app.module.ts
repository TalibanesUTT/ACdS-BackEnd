import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CustomConfigModule } from "./config/custom-config.module";
import { CustomConfigService } from "./config/custom-config.service";
import { createDataSource } from "./config/data-source.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./app/modules/auth/auth.module";
import { UsersModule } from "./app/modules/users/users.module";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AllExceptionFilter } from "./config/exception.filter";
import { JwtAuthGuard } from "./app/modules/auth/jwt-auth.guard";
import { RolesGuard } from "./common/roles.guard";
import { UserManagementModule } from "./app/modules/user-management/user-management.module";
import { SignedUrlModule } from "./app/services/signed-url/signed-url.module";
import { MailerModule } from "./app/services/mailer/mailer.module";
import { RandomCodeModule } from "./app/services/random-code/random-code.module";
import { VonageModule } from "./app/services/vonage/vonage.module";
import { SeederModule } from "./database/seeders/seeder.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        CustomConfigModule,

        TypeOrmModule.forRootAsync({
            imports: [CustomConfigModule],
            inject: [CustomConfigService],
            useFactory: async (configService: CustomConfigService) => {
                const dataSource = createDataSource(configService);
                await dataSource.initialize();
                return dataSource.options;
            },
        }),
        SignedUrlModule,
        MailerModule,
        RandomCodeModule,
        VonageModule,
        AuthModule,
        UsersModule,
        SeederModule,
        UserManagementModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor,
        },
        { provide: APP_FILTER, useClass: AllExceptionFilter },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class AppModule {}
