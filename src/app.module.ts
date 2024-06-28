import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CustomConfigModule } from "./config/custom-config.module";
import { CustomConfigService } from "./config/custom-config.service";
import { createDataSource } from "./config/data-source.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./app/modules/auth/auth.module";
import { UsersModule } from "./app/modules/users/users.module";
import { SeederModule } from "./database/seeders/seeder.module";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionFilter } from "./config/exception.filter";

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
        AuthModule,
        UsersModule,
        SeederModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        { provide: APP_FILTER, useClass: AllExceptionFilter },
    ],
})
export class AppModule {}
