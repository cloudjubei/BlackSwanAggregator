import { Injectable } from '@nestjs/common'
import { getFile } from 'src/lib/storageUtils'
import ConfigModel from 'src/models/config/ConfigModel.dto'
import ConfigSignalOutputModel from 'src/models/config/ConfigSignalOutputModel.dto'
import SignalModel from 'src/models/signal/SignalModel.dto'

@Injectable()
export class SignalOutputService
{
    private cache: { [id: string]: {[token: string] : SignalModel} } = {}

    constructor()
    {
        const configFile = getFile('config.json')
        const config = JSON.parse(configFile) as ConfigModel
        for(const id in config.signals_output){
            this.add(id, config.signals_output[id])
        }
    }

    storeInCache(id: string, signal: SignalModel)
    {
        this.cache[id][signal.tokenPair] = signal
    }
    getLatest(id: string, token: string) : SignalModel
    {
        return this.cache[id][token]
    }
  
    getAllSignals() : string[]
    {
        return Object.keys(this.cache)
    }

    hasSignal(id: string) : boolean
    {
        return this.cache[id] !== undefined
    }
    getSignalTokens(id: string) : string[]
    {
        return Object.keys(this.cache[id] ?? {})
    }

    add(id: string, config: ConfigSignalOutputModel)
    {
        this.cache[id] = {}
        
        for(const token of config.tokens){
            this.cache[id][token] = new SignalModel(token, 0, 0)
        }
    }

    removeSignal(id: string)
    {
        delete this.cache[id]
    }
    removeSignalToken(id: string, token: string)
    {
        delete this.cache[id][token]
    }
}