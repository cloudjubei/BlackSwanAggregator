import { Injectable } from "@nestjs/common"
import { Socket, io } from "socket.io-client"

@Injectable()
export class WSInputService
{
    private sockets: { [key: number]: Socket } = {}

    constructor()
    {
    }

    connect(port: number) : Socket
    {
        const socket = io("http://localhost:" + port)

        this.sockets[port] = socket

        return socket
    }

    listen(port: number, type: string, callback: (message: string) => void)
    {
        const socket = this.sockets[port]
        if (socket){
            socket.on(type, callback)
        }
    }

    async sendMessage(port: number, type: string, message: string) : Promise<any>
    {
        const socket = this.sockets[port]
        if (socket){
            return await socket.timeout(100).emitWithAck(type, message)
        }
    }
}