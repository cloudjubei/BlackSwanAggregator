import { Injectable } from '@nestjs/common'
import { getFile } from 'src/lib/storageUtils'
import ConfigModel from 'src/models/config/ConfigModel.dto'

@Injectable()
export class IdentityService
{
    config : ConfigModel

    constructor()
    {
        const configFile = getFile('config.json')
        this.config = JSON.parse(configFile) as ConfigModel
    }

    getConfig() : ConfigModel
    {
        return this.config
    }

    getOutSignalTokens() : { [id: string] : string[] }
    {
        const out = {}
        for(const id of this.config.identifiers_out){
            out[id] = this.config.signals_output[id].tokens
        }
        return out
    }
}
