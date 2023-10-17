import { Injectable } from '@nestjs/common'
import StorageUtils from 'commons/lib/storageUtils'
import ConfigModel from 'models/config/ConfigModel.dto'

@Injectable()
export class IdentityService
{
    config : ConfigModel

    constructor()
    {
        const configFile = StorageUtils.getFile('config.json')
        this.config = JSON.parse(configFile) as ConfigModel

        const tokens = this.getTokens()

        for(const id of Object.keys(this.config.prices_input)){
            const priceConfig = this.config.prices_input[id]
            if (!priceConfig["host"]){
                this.config.prices_input[id]["host"] = "http://localhost"
            }
        }

        for(const id of Object.keys(this.config.signals_input)){
            const signalConfig = this.config.signals_input[id]
            if (!signalConfig["host"]){
                this.config.signals_input[id]["host"] = "http://localhost"
            }
            if (!signalConfig["tokens"]){
                this.config.signals_input[id]["tokens"] = tokens
            }
            if (!signalConfig["intervals"]){
                this.config.signals_input[id]["intervals"] = this.config.intervals
            }
        }
        for(const id of Object.keys(this.config.signals_output)){
            const signalConfig = this.config.signals_output[id]
            if (!signalConfig["tokens"]){
                this.config.signals_output[id]["tokens"] = tokens
            }
            if (!signalConfig["intervals"]){
                this.config.signals_output[id]["intervals"] = this.config.intervals
            }
            if (!signalConfig["samples_required"]){
                this.config.signals_output[id]["samples_required"] = 1
            }
        }
    }

    getConfig() : ConfigModel
    {
        return this.config
    }

    getTokens() : string[]
    {
        return Object.keys(this.config.prices_input)
    }
}
