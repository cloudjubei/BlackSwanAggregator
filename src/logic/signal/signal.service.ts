import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { WSOutputService } from '../websockets/output/ws-output.service'
import { WSInputService } from '../websockets/input/ws-input.service'
import { SignalOutputService } from './output/signal-output.service'
import { IdentityService } from '../identity/identity.service'
import SignalModel from 'commons/models/signal/SignalModel.dto'
import PriceKlineModel from 'commons/models/price/PriceKlineModel.dto'
import TokenIndicatorsModel from 'commons/models/indicators/TokenIndicatorsModel.dto'
import { ConfigConnectionInputModelUtils } from 'commons/models/config/ConfigConnectionInputModel.dto'

@Injectable()
export class SignalService implements OnApplicationBootstrap
{
    hasSetup = false
    isUpdating = false

    constructor(
        private readonly wsInputService: WSInputService,
        private readonly wsOutputService: WSOutputService,
        private readonly identityService: IdentityService,
        private readonly signalOutputService: SignalOutputService,
    ){}

    onApplicationBootstrap()
    {
        this.setup()
    }

    private async setup()
    {
        if (this.hasSetup) { return }

        console.log(`SignalService setup ${Date.now()}`)

        this.signalOutputService.setup()
        this.setupWebsocketConnections()

        this.hasSetup = true
    }

    @Cron(CronExpression.EVERY_SECOND)
    async update()
    {
        if (!this.hasSetup || this.isUpdating) { return }

        console.log(`SignalCoreService update ${Date.now()}`)

        this.isUpdating = true
        try{
            await this.updatePricesInput()
            await this.updateIndicatorsInput()
            await this.updateSignalsInput()
            await this.updateSignalsOutput()
        }catch(error){
            console.error(`${error} trace: ${error.stack}`)
        }
        this.isUpdating = false
    }

    private setupWebsocketConnections()
    {
        for(const token of Object.keys(this.identityService.config.prices_input)){
            const config = this.identityService.config.prices_input[token]
            this.wsInputService.connect(ConfigConnectionInputModelUtils.GetUrl(config))
        }
        for(const id of Object.keys(this.identityService.config.signals_input)){
            const config = this.identityService.config.signals_input[id]
            this.wsInputService.connect(ConfigConnectionInputModelUtils.GetUrl(config))
        }

        // for(const id of Object.keys(this.identityService.config.signals_input)){
        //     const signalConfig = this.identityService.config.signals_input[id]
        //     for(const token of signalConfig.tokens){
        //         this.wsInputService.listen(signalConfig.port, token, (signal) => {
        //             console.log("LISTENED TO SIGNAL: ", signal)
        //         })
        //     }
        // }
    }

    private async updatePricesInput()
    {
        for(const tokenPair of Object.keys(this.identityService.config.prices_input)){
            const config = this.identityService.config.prices_input[tokenPair]
            for(const interval of this.identityService.config.intervals){
                try{
                    const price = await this.wsInputService.sendMessage(ConfigConnectionInputModelUtils.GetUrl(config), "price_latestKline", JSON.stringify({ tokenPair, interval }))
                    if (price){
                        this.signalOutputService.storePrice(price as PriceKlineModel)
                    }
                }catch(error){
                    // TODO: handle multiple timeouts
                    console.error("updatePricesInput tokenPair: " + tokenPair +  "interval: " + interval + " url: " + ConfigConnectionInputModelUtils.GetUrl(config) + " error: ", error)
                }
            }
        }
    }

    private async updateIndicatorsInput()
    {
        for(const tokenPair of Object.keys(this.identityService.config.prices_input)){
            const config = this.identityService.config.prices_input[tokenPair]
            for(const interval of this.identityService.config.intervals){
                try{
                    const indicators = await this.wsInputService.sendMessage(ConfigConnectionInputModelUtils.GetUrl(config), "indicators_latestInterval", JSON.stringify({ tokenPair, interval }))
                    if (indicators){
                        this.signalOutputService.storeIndicators(indicators as TokenIndicatorsModel)
                    }
                }catch(error){
                    // TODO: handle multiple timeouts
                    console.error("updateIndicatorsInput tokenPair: " + tokenPair +  "interval: " + interval + " url: " + ConfigConnectionInputModelUtils.GetUrl(config) + " error: ", error)
                }
            }
        }
    }

    private async updateSignalsInput()
    {
        for(const id of Object.keys(this.identityService.config.signals_input)){
            const signalConfig = this.identityService.config.signals_input[id]
            for(const token of signalConfig.tokens){
                try{
                    const signal = await this.wsInputService.sendMessage(ConfigConnectionInputModelUtils.GetUrl(signalConfig), "signal_latest", token)
                    if (signal){
                        this.signalOutputService.storeSignal(id, signal as SignalModel)
                    }
                }catch(error){
                    // TODO: handle multiple timeouts
                    console.error("updateSignals id: " + id + " url: " + ConfigConnectionInputModelUtils.GetUrl(signalConfig) + " token: " + token + " error: ", error)
                }
            }
        }
    }
    
    private async updateSignalsOutput()
    {
        const ids = this.signalOutputService.getAllSignals()
        for(const id of ids){
            const signalConfig = this.identityService.config.signals_output[id]
            for(const token of signalConfig.tokens){
                for(const interval of signalConfig.intervals){
                    const signal = this.signalOutputService.updateSignal(id, token, interval)
                    this.signalOutputService.storeSignal(id, signal)
                    await this.wsOutputService.sendUpdate(id, signal)
                }
            }
        }
    }
}
