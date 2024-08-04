import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/app/entities/user.entity";
import { Repository } from "typeorm";
import { RoleEnum } from "src/app/entities/role.entity";
import { CustomerDto } from "./dto/customer.dto";
import { ApiResponse } from "src/app/interfaces/api-response.interface";
import { UsersService } from "../users/users.service";
import { SecurePasswordService } from "src/app/services/secure-password/secure-password.service";
import { AuthService } from "../auth/auth.service";
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from "../user-management/dto/update-user.dto";

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly userService: UsersService,
        private readonly securePasswordService: SecurePasswordService,
        private readonly authService: AuthService
    ) {}

    async findAll(limit = 100): Promise<User[]> {
        const customers = await this.userRepository.find({
            where: { role: { value: RoleEnum.CUSTOMER} },
            take: limit,
        });

        if (!customers.length) {
            throw new NotFoundException("No hay clientes registrados");
        }

        return customers;
    }

    async findOne(id: number): Promise<User> {
        try {
            const user = await this.userService.find(id);

            if (user.role.value !== RoleEnum.CUSTOMER) {
                throw new NotFoundException("Cliente no encontrado");
            }
            return user;
        } catch (error) {
            Logger.error(error);
            throw new NotFoundException("Cliente no encontrado");
        }
    }

    async create(data: CustomerDto): Promise<ApiResponse<User>> {
        const { email, ...rest } = data;

        const existingUserByEmail = !!(await this.userService.findByEmail(email));

        if (existingUserByEmail) {
            throw new BadRequestException("El correo electrónico ya se encuentra en uso.");
        }

        const password = this.securePasswordService.generateSecurePassword(10);
        const hashedPassword = await bcrypt.hash(password, 10);
        const customer = this.userRepository.create({
            email,
            password: hashedPassword,
            changedByAdmin: true,
            ...rest,
        });

        const newUser = await this.userService.save(customer);

        if (newUser) {
            this.authService.sendEmailVerification(newUser, true, true, password);
        }

        return {
            status: 201,
            message: "Cliente registrado correctamente.",
            data: newUser,
        }
    }

    async update(id: number, data: UpdateUserDto): Promise<ApiResponse<User>> {
        var emailHasChanged = false;
        const customer = await this.userService.find(id);

        if (!customer || customer.role.value !== RoleEnum.CUSTOMER) {
            throw new NotFoundException("Cliente no encontrado");
        }

        const { email, phoneNumber, role, ...rest } = data;

        if (email && email !== customer.email) {
            const existingUserByEmail = !!(await this.userService.findByEmail(email));

            if (existingUserByEmail) {
                throw new BadRequestException("El correo electrónico ya se encuentra en uso");
            }

            customer.active = false;
            customer.emailConfirmed = false;
            emailHasChanged = true;
        }

        if (phoneNumber && phoneNumber !== customer.phoneNumber) {
            customer.phoneConfirmed = false;
            customer.changedByAdmin = true;
        }

        const updatedCustomer = this.userRepository.merge(customer, { ...rest, email, phoneNumber });
        const finalCustomer = await this.userRepository.save(updatedCustomer);

        if (emailHasChanged) {
            this.authService.sendEmailVerification(finalCustomer, false, true);
        }

        return {
            status: 200,
            message: "Cliente actualizado correctamente",
            data: finalCustomer
        };
    }
        
}