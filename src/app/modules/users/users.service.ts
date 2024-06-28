import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/app/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async find(id: number): Promise<User | null> {
        return await this.usersRepository.findOneBy({ id });
    }

    async save(user: User): Promise<User> {
        return await this.usersRepository.save(user);
    }


}
