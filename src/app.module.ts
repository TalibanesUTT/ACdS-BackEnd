import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { SeederService } from "./seeder/seeder.service";
import { RoleSeederService } from "./seeder/role.seeder/role.seeder.service";
import { SeederModule } from "./seeder/seeder.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule], // Make ConfigModule available
            inject: [ConfigService], // Inject ConfigService
            useFactory: (configService: ConfigService) => ({
                type: "mysql", // Or use configService.get('DATABASE_TYPE')
                host: configService.get("DATABASE_HOST", "mysql"),
                port: configService.get("DATABASE_PORT", 3306),
                username: configService.get("DATABASE_USERNAME", "root"),
                password: configService.get("DATABASE_PASSWORD", "docker"),
                database: configService.get("DATABASE_NAME", "ACdS_DB"),
                migrations: ["dist/database/migrations/*.js"],
                migrationsTableName: "_migrations",
                entities: ["dist/**/*.entity{.ts,.js}"],
                migrationsRun: true,
                logging: true,
            }),
        }),
        AuthModule,
        UsersModule,
        SeederModule,
    ],
    controllers: [AppController],
    providers: [AppService, ConfigService],
})
export class AppModule {}
