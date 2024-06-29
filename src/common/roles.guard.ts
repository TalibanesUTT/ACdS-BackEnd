import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { plainToClass } from "class-transformer";
import { RoleEnum } from "src/app/entities/role.entity";
import { User } from "src/app/entities/user.entity";
import { ROLES_KEY } from "src/config/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!requiredRoles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user: User = request.user;

        if (!user) {
            throw new ForbiddenException("Sesión invalida");
        }

        const serializedUser = plainToClass(User, user);

        const hasRole = requiredRoles.some(
            (role) => serializedUser.role == role,
        );

        if (!hasRole) {
            throw new ForbiddenException("Acceso denegado");
        }

        return hasRole;
    }
}
