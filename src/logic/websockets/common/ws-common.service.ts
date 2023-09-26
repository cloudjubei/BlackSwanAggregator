import { Server } from 'socket.io'
import { Injectable } from '@nestjs/common'

@Injectable()
export class WebsocketsService
{
    // @WebSocketServer() // TODO - would be great to have this work instead of passing server in WebsocketsGateway
    server: Server

    sendMessage(type: string, message: any)
    {
        this.server.emit(type, message)
    }

    sendMessageToRoom(type: string, message: any, roomId: string)
    {
        this.server.to(roomId).emit(type, message)
    }
}
