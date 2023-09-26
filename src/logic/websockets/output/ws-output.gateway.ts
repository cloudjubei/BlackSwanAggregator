import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody
  } from '@nestjs/websockets'
import { COMMON_GATEWAY } from '../websockets.gateway'
import SignalModel from 'src/models/signal/SignalModel.dto'
import WSSignalRequest from 'src/models/websockets/WSSignalRequest.dto'
import { SignalOutputService } from 'src/logic/signal/output/signal-output.service'
  
export const SIGNAL_PREFIX ='signal_'
export const MESSAGE_GET_LATEST = SIGNAL_PREFIX + 'latest'

@WebSocketGateway(COMMON_GATEWAY)
export class WSOutputGateway
{
    constructor(
        private readonly signalOutputService: SignalOutputService
    ) {}

    @SubscribeMessage(MESSAGE_GET_LATEST)
    async getLatest(@MessageBody() message: string) : Promise<SignalModel | undefined>
    {
        console.log(`MESSAGE_GET_LATEST: ${message}`)
        const m = JSON.parse(message) as WSSignalRequest

        return await this.signalOutputService.getLatest(m.identifier, m.tokenPair)
    }
}