import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from 'config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.databaseHost,
        port: config.databasePort,
        username: config.databaseUser,
        password: config.databasePassword,
        database: config.databaseName,
        migrations: ['dist/database/migrations/*.js'],
        migrationsTableName: '_migrations',
        migrationsRun: true,
        synchronize: true,
        logging: true,
      }),
    })
  ],
  controllers: [AppController, ConfigService],
  providers: [AppService, ConfigService],
})
export class AppModule {}