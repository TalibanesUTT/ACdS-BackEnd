import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true, // Automatically transform payload to DTO class instance
            whitelist: true, // Strip away any unknown properties
            forbidNonWhitelisted: true, // Throw error if unknown properties are found
        }),
    );

    const configSwagger = new DocumentBuilder()
        .setTitle("ACdS API")
        .setDescription("API para el proyecto ACdS")
        .setVersion("1.0")
        .addTag("ACdS")
        .build();

    const document = SwaggerModule.createDocument(app, configSwagger);
    SwaggerModule.setup("api", app, document);

    await app.listen(3000);
}
bootstrap();
