import {
    createParamDecorator,
    ExecutionContext,
    ForbiddenException,
} from "@nestjs/common";
import { User } from "src/app/entities/user.entity";

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest();
        console.log(request.user);
        const user: User = request.user;

        if (!user) {
            throw new ForbiddenException("Sesión invalida");
        }
        return user;
    },
);
