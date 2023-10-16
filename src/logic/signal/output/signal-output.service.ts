import { Injectable } from '@nestjs/common'
import { IdentityService } from 'src/logic/identity/identity.service'
import { SignalCache } from 'src/models/cache/SignalCache'
import ConfigSignalOutputModel from 'src/models/config/ConfigSignalOutputModel.dto'
import TokenIndicatorsModel from 'src/models/indicators/TokenIndicatorsModel.dto'
import PriceKlineModel from 'src/models/price/PriceKlineModel.dto'
import SignalModel from 'src/models/signal/SignalModel.dto'
import SignalOperation from 'src/models/signal/SignalOperation'

@Injectable()
export class SignalOutputService
{
    signalCaches: { [id: string] : SignalCache } = {}

    private signalOperations: { [id: string] : SignalOperation } = {}

    private nestComplexities: { [id: string]: string[] } = {}
    private signalsByNestComplexity: string[] = []
    private cacheSize = 10

    constructor(
        private readonly identityService: IdentityService
    )
    {
        const tokens = this.identityService.getTokens()
        const intervals = this.identityService.config.intervals
        const inputSignals = Object.keys(this.identityService.config.signals_input)
        const outputSignals = Object.keys(this.identityService.config.signals_output)

        const allInputIds = ["price", ...this.identityService.config.indicators_input,  ...inputSignals]

        for(const signalId of [...allInputIds, ...outputSignals]){
            const cache = new SignalCache()
            cache.setup(tokens, intervals, this.cacheSize)
            this.signalCaches[signalId] = cache
        }
        for(const id of outputSignals){
            const signalConfig = this.identityService.config.signals_output[id]
            this.prepare(id, signalConfig.inputs, signalConfig.operation)
        }
        for(const id of allInputIds){
            this.prepare(id, [], "$" + id)
        }

        this.signalsByNestComplexity = outputSignals.sort((a, b) => this.nestComplexities[a].length - this.nestComplexities[b].length)
    }

    setup()
    {
    }

    storePrice(price: PriceKlineModel)
    {
        this.signalCaches["price"].storeSignal(new SignalModel(price.tokenPair, price.interval, price.timestamp_open, parseFloat(price.price_close), 1))
    }

    storeIndicators(indicators: TokenIndicatorsModel)
    {
        for(const indicator of Object.keys(indicators.indicators)){
            const amount = parseFloat(indicators.indicators[indicator]) ?? 0
            this.signalCaches[indicator]?.storeSignal(new SignalModel(indicators.tokenPair, indicators.interval, indicators.timestamp, amount))
        }
    }

    storeSignal(id: string, signal: SignalModel)
    {
        this.signalCaches[id]?.storeSignal(signal)
    }

    getLatest(id: string, token: string, interval: string) : SignalModel
    {
        return this.signalCaches[id].getLatest(token, interval)
    }
  
    getAllSignals() : string[]
    {
        return this.signalsByNestComplexity
    }

    updateSignal(id: string, token: string, interval: string) : SignalModel
    {
        const signalConfig = this.identityService.config.signals_output[id]
        // if (!this.isPassingResetStrategy(id, token, interval, signalConfig)){
        //     return new SignalModel(token, interval, Date.now(), 0, 1)
        // }
        const timestamp = this.getDependencyLowestTimestamp(token, interval, signalConfig)
        const referenceValues = this.getDependencyValues(token, interval, signalConfig)
        const action = this.signalOperations[id].process(referenceValues)
        return new SignalModel(token, interval, timestamp, action)
    }

    private prepare(id: string, inputs: string[], operation: string)
    {
        this.nestComplexities[id] = []

        for(let signal of inputs){
            if (signal.includes('$')){
                signal = signal.substring(1, signal.length)
                this.nestComplexities[id].push(signal)
            }
        }
        this.signalOperations[id] = new SignalOperation(operation)
    }

    // private isPassingResetStrategy(id: string, token: string, interval: string, signalConfig: ConfigSignalOutputModel) : Boolean
    // {
    //     if (signalConfig.resets_every_tick_for_all || signalConfig.resets_every_tick){
    //         const lastTimestamp = this.getLatest(id, token, interval).timestamp
    
    //         let reset_satisfied = signalConfig.resets_every_tick_for_all ? signalConfig.inputs.length : 1
            
    //         for(const signal of signalConfig.inputs){
    //             const timestamp = this.getLatest(signal, token, interval).timestamp
    //             if (timestamp > lastTimestamp) {
    //                 reset_satisfied -= 1
    //             }
    //         }
    //         return reset_satisfied <= 0
    //     }
    //     return true
    // }

    private getDependencyLowestTimestamp(token: string, interval: string, signalConfig: ConfigSignalOutputModel) : number
    {
        let timestamp = Date.now()
        for(const input of signalConfig.inputs){
            const t = this.signalCaches[input]?.getLatest(token, interval).timestamp
            if (t && t < timestamp){
                timestamp = t
            }
        }
        return timestamp
    }
    private getDependencyValues(token: string, interval: string, signalConfig: ConfigSignalOutputModel) : {[key:string] : number}
    {
        const dependencies : {[key:string] : number} = {}
        for(const input of signalConfig.inputs){
            const number = this.signalCaches[input]?.getLatest(token, interval).action ?? 0
            dependencies[input] = number
        }
        return dependencies
    }
}