import { Module } from "@nestjs/common";
import { CarBrandsService } from "./car-brands.service";
import { CarBrandsController } from "./car-brands.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarBrand } from "src/app/entities/car-brand.entity";
import { JwtModule } from "@nestjs/jwt";
import { CustomConfigModule } from "src/config/custom-config.module";
import { CustomConfigService } from "src/config/custom-config.service";
import { SignedUrlModule } from "src/app/services/signed-url/signed-url.module";

@Module({
    imports: [
        SignedUrlModule,
        JwtModule.registerAsync({
            imports: [CustomConfigModule],
            inject: [CustomConfigService],
            useFactory: async (configService: CustomConfigService) => ({
                secret: configService.jwtSecret,
                signOptions: { expiresIn: "60m" },
            }),
        }),
        TypeOrmModule.forFeature([CarBrand]),
    ],
    providers: [CarBrandsService],
    controllers: [CarBrandsController],
})
export class CarBrandsModule {}
