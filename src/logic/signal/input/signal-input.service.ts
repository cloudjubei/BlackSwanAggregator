import { Injectable } from '@nestjs/common'
import { getFile } from 'src/lib/storageUtils'
import ConfigModel from 'src/models/config/ConfigModel.dto'
import ConfigSignalInputModel from 'src/models/config/ConfigSignalInputModel.dto'

@Injectable()
export class SignalInputService
{
    private signalsConfig: { [id: string]: ConfigSignalInputModel } = {}

    constructor()
    {
        const configFile = getFile('config.json')
        const config = JSON.parse(configFile) as ConfigModel
        for(const signal in config.signals_input){
            this.add(signal, config.signals_input[signal])
        }
    }
  
    getAllSignals() : string[]
    {
        return Object.keys(this.signalsConfig)
    }
    getAllPorts() : number[]
    {
        return Object.values(this.signalsConfig).map(signal => signal.port)
    }

    hasSignal(signal: string) : boolean
    {
        return this.signalsConfig[signal] !== undefined
    }
    getSignal(signal: string) : ConfigSignalInputModel | undefined
    {
        return this.signalsConfig[signal]
    }

    hasPort(port: number) : boolean
    {
        return this.getAllPorts().find(p => p === port) !== undefined
    }

    add(id: string, config: ConfigSignalInputModel)
    {
        this.signalsConfig[id] = config
    }

    removeSignal(signal: string)
    {
        delete this.signalsConfig[signal]
    }
}