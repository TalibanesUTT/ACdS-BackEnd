import { DataSource } from "typeorm";
import { CustomConfigService } from "./custom-config.service";

export const createDataSource = (configService: CustomConfigService): DataSource => {
    return new DataSource({
        type: "mysql",
        host: configService.databaseHost,
        port: configService.databasePort,
        username: configService.databaseUser,
        password: configService.databasePassword,
        database: configService.databaseName,
        migrations: ["dist/database/migrations/*.js"],
        migrationsTableName: "_migrations",
        entities: ["dist/**/*.entity{.ts,.js}"],
        migrationsRun: true,
        timezone: "local",
        logging: true,
        synchronize: false,
    });
};