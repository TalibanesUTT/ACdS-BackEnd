import { Injectable } from "@nestjs/common";
import { RoleSeederService } from "./role.seeder/role.seeder.service";

@Injectable()
export class SeederService {
    constructor(
        private readonly roleSeederService: RoleSeederService,
        // private readonly userSeederService: UserSeederService
    ) {}

    async seed() {
        await this.roleSeederService.seed();
    }
}
