import { Test, TestingModule } from "@nestjs/testing";
import { RoleSeederService } from "./role.seeder.service";

describe("RoleSeederService", () => {
    let service: RoleSeederService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RoleSeederService],
        }).compile();

        service = module.get<RoleSeederService>(RoleSeederService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
