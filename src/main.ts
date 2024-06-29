import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { configDotenv } from "dotenv";
import { createDataSource } from "./config/data-source.config";
import { CustomConfigService } from "./config/custom-config.service";
import { SeederService } from "./database/seeders/seeder.service";
import { AllExceptionFilter } from "./config/exception.filter";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as hbs from 'express-handlebars';
import { extname, join } from "path";

async function bootstrap() {
    configDotenv();
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const dataSource = await (async () => {
        const configService = app.get(CustomConfigService);
        return createDataSource(configService);
    })();
    await dataSource.initialize();

    // Enable global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true, // Automatically transform payload to DTO class instance
            whitelist: true, // Strip away any unknown properties
            forbidNonWhitelisted: true, // Throw error if unknown properties are found
        }),
    );

    app.useGlobalFilters(new AllExceptionFilter());

    const seeder = app.get(SeederService);
    await seeder.seed();

    const configSwagger = new DocumentBuilder()
        .setTitle("ACdS API")
        .setDescription("API para el proyecto ACdS")
        .setVersion("1.0")
        .addBearerAuth()
        .addTag("ACdS")
        .build();

    const document = SwaggerModule.createDocument(app, configSwagger);
    SwaggerModule.setup("api", app, document);

    app.engine("hbs", 
        hbs.engine({
            extname: "hbs",
            defaultLayout: false,
        })
    );
    app.setViewEngine("hbs");
    app.setBaseViewsDir(join(__dirname, "..", "src", "app", "resources", "views"));

    app.enableCors();
    await app.listen(3000);
}
bootstrap();
