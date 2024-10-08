import { Injectable } from "@nestjs/common";
import { RoleSeederService } from "./role.seeder/role.seeder.service";
import { UserSeederService } from "./user.seeder.service";
import { ServiceSeederService } from "./service.seeder.service";

@Injectable()
export class SeederService {
    constructor(
        private readonly roleSeederService: RoleSeederService,
        private readonly userSeeder: UserSeederService,
        private readonly serviceSeeder: ServiceSeederService,
    ) {}

    async seed() {
        await this.roleSeederService.seed();
        await this.userSeeder.seed();
        await this.serviceSeeder.seed();
    }
}
