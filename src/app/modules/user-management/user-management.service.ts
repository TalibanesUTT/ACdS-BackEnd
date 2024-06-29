import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import { User } from "src/app/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

@Injectable()
export class UserManagementService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async getUsers() {
        const users = (await this.userRepository.find()).map((user) =>
            plainToClass(User, user),
        );

        return users;
    }

    async updateUser(id: number, updatedData: Partial<User>) {
        try {
            const user = await this.userRepository.findOneByOrFail({ id });

            const updatedUser = this.userRepository.merge(user, updatedData);

            const finalUser = await this.userRepository.save(updatedUser);
            return plainToClass(User, finalUser);
        } catch (error) {
            Logger.error(error);
            if (error.name === "EntityNotFoundError") {
                throw new NotFoundException("Usuario no encontrado");
            } else {
                throw new BadRequestException("Datos invalidos");
            }
        }
    }
}
