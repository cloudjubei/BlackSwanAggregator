import { Injectable } from '@nestjs/common'
import { WebsocketsService } from '../common/ws-common.service'

@Injectable()
export class WSOutputService
{
    constructor(private readonly websocketsService: WebsocketsService){}

    async sendUpdate(identifier: string, tokenPair: string, action: number)
    {
        console.log(`WS ACTION of ${tokenPair} : ${JSON.stringify({ action, identifier })}`)
        this.websocketsService.sendMessage(tokenPair, { action, identifier })
    }
}