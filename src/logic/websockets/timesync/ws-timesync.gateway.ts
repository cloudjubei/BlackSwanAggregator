import {
    SubscribeMessage,
    WebSocketGateway,
    ConnectedSocket,
    OnGatewayConnection,
  } from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { COMMON_GATEWAY } from '../websockets.gateway'
  
export const MESSAGE_TIMESYNC = 'time-sync'

@WebSocketGateway(COMMON_GATEWAY)
export class WSTimesyncGateway implements OnGatewayConnection
{
    handleConnection(socket: Socket)
    {
        this.sendTimesync(socket)
    }

    @SubscribeMessage(MESSAGE_TIMESYNC)
    timesync(@ConnectedSocket() socket: Socket) : number
    {
        this.sendTimesync(socket)
        return Date.now()
    }

    private sendTimesync(socket: Socket)
    {
        socket.emit(MESSAGE_TIMESYNC, Date.now())
    }
}