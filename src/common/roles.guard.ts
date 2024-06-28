import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
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
        console.log(user.role);

        if (!user) {
            return false;
        }

        return requiredRoles.some((role) => user.role.value == role);
    }
}
