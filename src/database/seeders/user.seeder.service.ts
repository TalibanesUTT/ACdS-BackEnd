import { Injectable } from "@nestjs/common";
import { BaseSeederService } from "./base.seeder.service";
import { User } from "src/app/entities/user.entity";
import { Repository, DeepPartial } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/app/entities/role.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserSeederService extends BaseSeederService<User> {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {
        super();
    }
    protected get repository(): Repository<User> {
        return this.userRepository;
    }

    protected get data(): Promise<DeepPartial<User>[]> {
        return this.roleRepository.find().then((roles) =>
            roles.map((role) => ({
                name: "John",
                lastName: "Doe",
                email: `john.doe@${role.value.toLowerCase()}.com`,
                password: bcrypt.hashSync("Masterkey$123", 10),
                phoneNumber: "1234567892",
                role: role,
                active: true,
            })),
        );
    }

    protected getIdentity(entity: DeepPartial<User>) {
        return entity.email;
    }
}
