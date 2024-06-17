import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "src/entities/role.entity";
import { SeederService } from "./seeder.service";
import { RoleSeederService } from "./role.seeder/role.seeder.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Role]), // Import TypeOrmModule with your entities
    ],
    providers: [
        SeederService, // Include SeederService
        RoleSeederService, // Include RoleSeederService
    ],
    exports: [
        SeederService, // Export SeederService if you want to use it outside this module
        RoleSeederService, // Export RoleSeederService if you want to use it outside this module
    ],
})
export class SeederModule {}
