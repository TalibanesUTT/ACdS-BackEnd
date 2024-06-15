import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'mysql',
  port: 3306,
  username: 'root',
  password: 'docker',
  database: 'ACdS_DB',
  entities: [],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: true,
});
