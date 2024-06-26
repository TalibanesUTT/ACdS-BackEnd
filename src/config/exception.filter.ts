import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, Injectable, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof HttpException ? exception.getResponse() : exception;
        const stack = exception instanceof Error ? exception.stack : '';

        this.logger.error(`Status: ${status}, Error: ${JSON.stringify(message)}, Stack: ${stack}`);

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: message,
            stack: stack,
        });
    }
}