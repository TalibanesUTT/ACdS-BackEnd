import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role, RoleEnum } from "src/app/entities/role.entity";
import { DeepPartial, Repository } from "typeorm";
import { BaseSeederService } from "../base.seeder.service";

@Injectable()
export class RoleSeederService extends BaseSeederService<Role> {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {
        super();
    }
    protected get repository(): Repository<Role> {
        return this.roleRepository;
    }

    protected getIdentity(entity: DeepPartial<Role>) {
        return entity.value;
    }

    protected get data(): Promise<DeepPartial<Role>[]> {
        return Promise.resolve(
            Object.values(RoleEnum).map((value) => ({ value })),
        );
    }
}
