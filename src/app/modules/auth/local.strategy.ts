import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "src/app/entities/user.entity";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: "email",
        });
    }
    async validate(username: string, password: string): Promise<User> {
        const user = await this.authService.validateUser(username, password);

        if (!user) {
            throw new UnauthorizedException(
                "Credenciales de usuario incorrectas",
            );
        }

        if (!user.emailConfirmed) {
            throw new UnauthorizedException(
                "Tu correo electrónico no ha sido confirmado",
            );
        }
        return user;
    }
}
