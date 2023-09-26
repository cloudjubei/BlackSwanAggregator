import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    OnGatewayConnection
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { WebsocketsService } from './common/ws-common.service'
  
export const MESSAGE_TEST = 'test'

export const COMMON_GATEWAY = {
    cors: { origin: '*' },
    pingTimeout: 60000, //60s
    pingInterval: 10000, //10s
    // transports: ["websocket"]
}

@WebSocketGateway(COMMON_GATEWAY)
export class WebsocketsGateway implements OnGatewayInit, OnGatewayConnection
{
    constructor(private readonly websocketsService: WebsocketsService) {}
    
    afterInit(server: Server)
    {
        server.setMaxListeners(100)
        this.websocketsService.server = server
        console.log(`WebSockets started`)
    }
    handleConnection(socket: Socket)
    {
        socket.setMaxListeners(100)
        console.log(`new connection - clientsCount: ${this.websocketsService.server.sockets.server.engine.clientsCount}`)
    }

    @SubscribeMessage(MESSAGE_TEST)
    async messageTest(@MessageBody() message: string)
    {
        console.log(`MESSAGE_TEST: ${message}`)
    }
}