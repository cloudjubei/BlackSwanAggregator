import { Injectable } from '@nestjs/common'
import { getFile } from 'src/lib/storageUtils'
import ConfigModel from 'src/models/config/ConfigModel.dto'
import ConfigSignalInputModel from 'src/models/config/ConfigSignalInputModel.dto'
import SignalModel from 'src/models/signal/SignalModel.dto'

@Injectable()
export class SignalInputService
{
    private cache: { [id: string]: {[token: string] : SignalModel} } = {}
    private ports: { [id: string]: number } = {}

    constructor()
    {
        const configFile = getFile('config.json')
        const config = JSON.parse(configFile) as ConfigModel
        for(const signal in config.signals_input){
            this.add(signal, config.signals_input[signal])
        }
    }

    storeInCache(id: string, signal: SignalModel)
    {
        this.cache[id][signal.tokenPair] = signal
    }
    getFromCache(id: string, token: string) : SignalModel
    {
        return this.cache[id][token]
    }
  
    getAllSignals() : string[]
    {
        return Object.keys(this.cache)
    }
    getAllPorts() : number[]
    {
        return Object.values(this.ports)
    }

    hasSignal(signal: string) : boolean
    {
        return this.cache[signal] !== undefined
    }
    getSignalPort(signal: string) : number | undefined
    {
        return this.ports[signal]
    }
    getSignalTokens(signal: string) : string[]
    {
        return Object.keys(this.cache[signal] ?? {})
    }

    hasPort(port: number) : boolean
    {
        return this.getAllPorts().find(p => p === port) !== undefined
    }

    add(id: string, config: ConfigSignalInputModel)
    {
        this.ports[id] = config.port
        this.cache[id] = {}
        
        for(const token of config.tokens){
            this.cache[id][token] = new SignalModel(token, 0, 0)
        }
    }

    removeSignal(signal: string)
    {
        delete this.cache[signal]
        delete this.ports[signal]
    }
}