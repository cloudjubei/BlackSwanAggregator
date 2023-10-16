import { Injectable } from '@nestjs/common'
import { WebsocketsService } from '../common/ws-common.service'
import SignalModel from 'src/models/signal/SignalModel.dto'

@Injectable()
export class WSOutputService
{
    constructor(private readonly websocketsService: WebsocketsService){}

    async sendUpdate(identifier: string, signal: SignalModel)
    {
        // console.log(`WS UPDATE on ${identifier + '-' + signal.tokenPair + '-' + signal.interval} : ${JSON.stringify({ identifier, ...signal })}`)
        this.websocketsService.sendMessage(identifier + '-' + signal.tokenPair + '-' + signal.interval, { identifier, ...signal })
    }
}