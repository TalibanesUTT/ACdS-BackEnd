import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'docker',
    database: 'ACdS_DB',
    entities: [],
    migrations: ['database/migrations/*.ts'],
    synchronize: true
});