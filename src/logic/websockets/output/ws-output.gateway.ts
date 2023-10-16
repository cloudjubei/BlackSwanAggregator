import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody
  } from '@nestjs/websockets'
import { COMMON_GATEWAY } from '../websockets.gateway'
import WSSignalRequest from 'models/websockets/WSSignalRequest.dto'
import { SignalOutputService } from 'logic/signal/output/signal-output.service'
import SignalModel from 'commons/models/signal/SignalModel.dto'
  
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

        return await this.signalOutputService.getLatest(m.identifier, m.tokenPair, m.interval)
    }
}