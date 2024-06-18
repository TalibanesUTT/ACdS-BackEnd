import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { configDotenv } from "dotenv";
import { SeederService } from "./seeder/seeder.service";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    configDotenv();

    // Enable global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true, // Automatically transform payload to DTO class instance
            whitelist: true, // Strip away any unknown properties
            forbidNonWhitelisted: true, // Throw error if unknown properties are found
        }),
    );

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

    app.enableCors();
    await app.listen(3000);
}
bootstrap();
