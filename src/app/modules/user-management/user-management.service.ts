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
import { Role } from "src/app/entities/role.entity";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserManagementService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}

    async getUsers() {
        const users = (await this.userRepository.find()).map((user) =>
            plainToClass(User, user),
        );
        return users;
    }

    async updateUser(id: number, updatedData: UpdateUserDto) {
        try {
            const user = await this.userRepository.findOneOrFail({
                where: { id },
                relations: ["role"],
            });

            const role = await this.roleRepository.findOneBy({
                value: updatedData.role,
            });

            const formattedUser = {
                ...updatedData,
                role,
            };

            // Merge the updated data
            const updatedUser = this.userRepository.merge(user, formattedUser);

            // Save the updated user back to the database
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
