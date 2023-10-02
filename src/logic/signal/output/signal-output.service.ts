import { Injectable } from '@nestjs/common'
import { getFile } from 'src/lib/storageUtils'
import ConfigModel from 'src/models/config/ConfigModel.dto'
import ConfigSignalOutputModel from 'src/models/config/ConfigSignalOutputModel.dto'
import SignalModel from 'src/models/signal/SignalModel.dto'
import SignalType from 'src/models/signal/SignalType.dto'

@Injectable()
export class SignalOutputService
{
    private cache: { [id: string]: {[token: string] : SignalModel[]} } = {}
    private outputConfig: { [key:string] : ConfigSignalOutputModel } = {}
    private signalDependencies: { [id: string]: string[] } = {}
    private nestComplexities: { [id: string]: string[] } = {}
    private signalsByNestComplexity: string[] = []
    private cacheSize = 1

    constructor()
    {
        const configFile = getFile('config.json')
        const config = JSON.parse(configFile) as ConfigModel
        this.outputConfig = config.signals_output

        for(const id in this.outputConfig){
            this.outputConfig[id].samples_required = this.outputConfig[id].samples_required ?? 1
            this.cacheSize = Math.max(this.cacheSize, this.outputConfig[id].samples_required)
            this.add(id, this.outputConfig[id])
        }
        const signals = Object.keys(config.signals_output)
        this.signalsByNestComplexity = signals.sort((a, b) => this.nestComplexities[a].length - this.nestComplexities[b].length)

        for(const id in config.signals_input){
            this.prepareSignal(id, config.signals_input[id].tokens)
        }
    }

    storeInCache(id: string, signal: SignalModel)
    {
        this.cache[id][signal.tokenPair] = [signal, ...this.cache[id][signal.tokenPair]]
        if (this.cache[id][signal.tokenPair].length > this.cacheSize){
            this.cache[id][signal.tokenPair].pop()
        }
    }
    getLatest(id: string, token: string) : SignalModel
    {
        const signals = this.cache[id][token]
        if (signals.length > 0){
            return signals[0]
        }
        return new SignalModel(token, 0, 0)
    }
  
    getAllSignals() : string[]
    {
        return this.signalsByNestComplexity
    }

    hasSignal(id: string) : boolean
    {
        return this.cache[id] !== undefined
    }
    getSignalTokens(id: string) : string[]
    {
        return Object.keys(this.cache[id] ?? {})
    }

    prepareSignal(id: string, tokens: string[])
    {
        this.cache[id] = {}
        this.signalDependencies[id] = []
        this.nestComplexities[id] = []
        
        for(const token of tokens){
            this.cache[id][token] = []
        }
    }
    add(id: string, config: ConfigSignalOutputModel)
    {
        this.prepareSignal(id, config.tokens)

        for(let signal of config.signals){
            if (signal.includes('$')){
                signal = signal.substring(1, signal.length)
                this.nestComplexities[id].push(signal)
            }
            this.signalDependencies[id].push(signal)
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

    updateSignal(id: string, token: string) : SignalModel
    {
        const signalConfig = this.outputConfig[id]
        if (!this.isPassingResetStrategy(id, token, signalConfig)){
            return new SignalModel(token, 0, Date.now(), 1)
        }

        const actions = this.getDependencyActions(id, token, signalConfig)
        const action = this.processActions(actions, signalConfig)

        return new SignalModel(token, action, Date.now(), 1)
    }

    private isPassingResetStrategy(id: string, token: string, signalConfig: ConfigSignalOutputModel) : Boolean
    {
        if (signalConfig.resets_every_tick_for_all || signalConfig.resets_every_tick){
            const lastTimestamp = this.getLatest(id, token).timestamp
    
            let reset_satisfied = signalConfig.resets_every_tick_for_all ? this.signalDependencies[id].length : 1
            
            for(const signal of this.signalDependencies[id]){
                const timestamp = this.getLatest(signal, token).timestamp
                if (timestamp > lastTimestamp) {
                    reset_satisfied -= 1
                }
            }
            return reset_satisfied <= 0
        }
        return true
    }

    private getDependencyActions(id: string, token: string, signalConfig: ConfigSignalOutputModel) : number[]
    {
        const actions : number[] = []
        for(const signal of this.signalDependencies[id]){
            if (this.cache[signal][token].length < signalConfig.samples_required){
                return []
            }
                
            const neededActions = []
            
            for(let i=0; i<signalConfig.samples_required; i++){
                neededActions.push(this.cache[signal][token][i].action)
            }

            const signalAction = this.processActions(neededActions, signalConfig, true)
            actions.push(signalAction)
        }
        return actions
    }

    private processActions(actions: number[], signalConfig: ConfigSignalOutputModel, fastForwardSingleValue: Boolean = false) : number
    {   
        const action = this.getActionsValue(actions, signalConfig, fastForwardSingleValue)
        return Math.max(-1, Math.min(1, action))
    }

    private getActionsValue(actions: number[], signalConfig: ConfigSignalOutputModel, fastForwardSingleValue: Boolean) : number
    {
        if (actions.length === 0){
            return 0
        }
        if (fastForwardSingleValue && actions.length === 1) { 
            return actions[0] 
        }
        switch(signalConfig.type){
            case SignalType.AVERAGE:
                return actions.reduce((acc, a) => acc + a, 0) / actions.length
            case SignalType.MINIMUM:
                return actions.reduce((acc, a) => a < acc ? a : acc, Number.POSITIVE_INFINITY)
            case SignalType.MAXIMUM:
                return actions.reduce((acc, a) => a > acc ? a : acc, Number.NEGATIVE_INFINITY)
            case SignalType.MULTIPLY:
                return actions.reduce((acc, a) => acc * a, 1)
            case SignalType.NEGATE:
                return -actions[0]
            case SignalType.CONSTANT_MULTIPLY:
                return actions[0] * (signalConfig.constant ?? 1)
            case SignalType.CONSTANT_OFFSET:
                return actions[0] + (signalConfig.constant ?? 0)
            default:
                return actions.reduce((acc, a) => acc + a, 0)
        }
    }
}