import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    Logger,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class SignedUrlGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = request.query.token;

        if (!token) {
            throw new ForbiddenException("Firma inválida");
        }

        try {
            // Verify the token
            const payload = this.jwtService.verify(token);
            const { sub } = payload;

            // Extract resource ID from URL
            const urlParts = request.url.split("/");
            const lastPart = urlParts[urlParts.length - 1];
            const resourceId = lastPart.split("?")[0];

            if (sub != resourceId) {
                throw new UnauthorizedException(
                    "Firma inválida para este recurso",
                );
            }

            const expirationDate = new Date(payload.exp * 1000);
            if (expirationDate < new Date()) {
                throw new ForbiddenException("Token expirado");
            }

            return true;
        } catch (error) {
            Logger.error(error);
            return false;
        }
    }
}
