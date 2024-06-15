import { DataSource } from "typeorm";
import { config } from "dotenv";

config();
export default new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'docker',
    database: 'ACdS_DB',
    migrations: ['dist/database/migrations/*.js'],
    migrationsTableName: '_migrations',
    migrationsRun: true,
    synchronize: true,
    logging: true
});
