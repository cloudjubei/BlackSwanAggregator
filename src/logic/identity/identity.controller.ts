import { Controller, Get } from '@nestjs/common'
import { ApiTags } from "@nestjs/swagger"
import { IdentityService } from './identity.service'
import ConfigModel from 'models/config/ConfigModel.dto'

@ApiTags("identity")
@Controller("identity")
export class IdentityController
{
    constructor(private readonly identityService: IdentityService) {}

    @Get('config')
    async getConfig() : Promise<ConfigModel>
    {
        return await this.identityService.getConfig()
    }
}