import {
    WebSocketGateway,
    SubscribeMessage
  } from '@nestjs/websockets'
import { COMMON_GATEWAY } from '../websockets.gateway'
import { IdentityService } from 'logic/identity/identity.service'
import ConfigModel from 'models/config/ConfigModel.dto'
  
export const IDENTITY_PREFIX ='identity_'
export const MESSAGE_GET_TYPE = IDENTITY_PREFIX + 'type'
export const MESSAGE_GET_IDENTIFIER = IDENTITY_PREFIX + 'identifier'
export const MESSAGE_GET_TOKENS = IDENTITY_PREFIX + 'tokens'


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