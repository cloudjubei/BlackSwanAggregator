import { Injectable } from "@nestjs/common"
import { Socket, io } from "socket.io-client"

@Injectable()
export class WSInputService
{
    private sockets: { [key: string]: Socket } = {}

    constructor()
    {
    }

    connect(url: string) : Socket
    {
        if (this.sockets[url]){
            return this.sockets[url]
        }
        
        const socket = io(url)

        this.sockets[url] = socket

        return socket
    }

    listen(url: string, type: string, callback: (message: string) => void)
    {
        const socket = this.sockets[url]
        if (socket){
            socket.on(type, callback)
        }
    }

    async sendMessage(url: string, type: string, message: any) : Promise<any>
    {
        const socket = this.sockets[url]
        if (socket){
            return await socket.timeout(100).emitWithAck(type, message)
        }
    }
}