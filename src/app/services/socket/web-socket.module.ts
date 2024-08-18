import { Module } from "@nestjs/common";
import { SocketGateway } from "./web-socket-gateway";

@Module({
    providers: [SocketGateway],
    exports: [SocketGateway]
})
export class WebSocketModule { }