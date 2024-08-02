import {
    createParamDecorator,
    ExecutionContext,
    UnauthorizedException,
} from "@nestjs/common";
import { User } from "src/app/entities/user.entity";

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest();
        console.log(request.user);
        const user: User = request.user;
        if (!user) {
            throw new UnauthorizedException(
                "Sesión invalida: No estás autorizado para realizar esta petición",
            );
        }
        return user;
    },
);
