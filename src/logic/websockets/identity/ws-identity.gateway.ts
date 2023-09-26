import {
    WebSocketGateway,
    SubscribeMessage
  } from '@nestjs/websockets'
import { COMMON_GATEWAY } from '../websockets.gateway'
import { IdentityService } from 'src/logic/identity/identity.service'
import ConfigModel from 'src/models/config/ConfigModel.dto'
  
export const IDENTITY_PREFIX ='identity_'
export const MESSAGE_GET_TYPE = IDENTITY_PREFIX + 'type'
export const MESSAGE_GET_IDENTIFIER = IDENTITY_PREFIX + 'identifier'
export const MESSAGE_GET_TOKENS = IDENTITY_PREFIX + 'tokens'
export const MESSAGE_GET_IDENTIFIERS_OUT = IDENTITY_PREFIX + 'identifiers_out'


@WebSocketGateway(COMMON_GATEWAY)
export class WSIdentityGateway
{
    constructor(
        private readonly identityService: IdentityService
    ) {}

    @SubscribeMessage(MESSAGE_GET_TYPE)
    async getType() : Promise<ConfigModel>
    {
        console.log(`MESSAGE_GET_TYPE`)

        return await this.identityService.getConfig()
    }
}