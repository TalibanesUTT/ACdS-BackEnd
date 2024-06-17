import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/entities/user.entity";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async validateUser(email: string, pass: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            return null;
        }

        const isValid = await user.comparePassword(pass);

        return isValid ? user : null;
    }
    async generateToken(user: User) {
        const payload: JwtPayload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(data: registerData): Promise<User> {
        const { email, password, phone, ...rest } = data;

        const existingUserByEmailOrPhone = await this.userRepository.findOneBy({
            email,
            phoneNumber: phone,
        });

        if (existingUserByEmailOrPhone) {
            throw new NotFoundException("El usuario ya existe en el sistema.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            phoneNumber: phone,
            ...rest,
        });

        return this.userRepository.save(user);
    }
}

export type JwtPayload = { email: string; sub: number };
interface registerData {
    name: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
}
