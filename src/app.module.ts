import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { ConfigService } from "./config/config.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: "mysql",
                host: "mysql",
                port: 3310,
                username: "root",
                password: "docker",
                database: "ACdS_DB",
                migrations: ["dist/database/migrations/*.js"],
                migrationsTableName: "_migrations",
                entities: ["dist/**/*.entity{.ts,.js}"], // 'dist/**/*.entity{.ts,.js}
                migrationsRun: true,
                logging: true,
            }),
        }),
        AuthModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService, ConfigService],
})
export class AppModule {}
