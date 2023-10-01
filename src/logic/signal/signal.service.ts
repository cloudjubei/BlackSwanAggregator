import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { WSOutputService } from '../websockets/output/ws-output.service'
import SignalModel from 'src/models/signal/SignalModel.dto'
import { SignalInputService } from './input/signal-input.service'
import { WSInputService } from '../websockets/input/ws-input.service'
import { SignalOutputService } from './output/signal-output.service'

@Injectable()
export class SignalService implements OnApplicationBootstrap
{
    hasSetup = false
    isUpdating = false

    constructor(
        private readonly wsInputService: WSInputService,
        private readonly wsOutputService: WSOutputService,
        private readonly signalInputService: SignalInputService,
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

        this.setupWebsocketConnections()

        this.hasSetup = true

        console.log(`SignalService done`)
    }

    @Cron(CronExpression.EVERY_SECOND)
    async update()
    {
        if (!this.hasSetup || this.isUpdating) { return }

        console.log(`SignalCoreService update ${Date.now()}`)

        this.isUpdating = true
        try{
            await this.updateSignalsInput()
            await this.updateSignalsOutput()
        }catch(error){
            console.error(`${error} trace: ${error.stack}`)
        }
        this.isUpdating = false
    }

    private setupWebsocketConnections()
    {
        const signalPorts = this.signalInputService.getAllPorts()
        for(const port of signalPorts){
            this.wsInputService.connect(port)
        }

        const signalIds = this.signalInputService.getAllSignals()
        for(const signalId of signalIds){
            const signalConfig = this.signalInputService.getSignal(signalId)
            for(const token of signalConfig.tokens){
                this.wsInputService.listen(signalConfig.port, token, (signal) => {
                    console.log("LISTENED TO SIGNAL: ", signal)
                })
            }
        }
    }

    private async updateSignalsInput()
    {
        const ids = this.signalInputService.getAllSignals()
        for(const id of ids){
            const signalConfig = this.signalInputService.getSignal(id)
            for(const token of signalConfig.tokens){
                try{
                    const signal = await this.wsInputService.sendMessage(signalConfig.port, "signal_latest", token)
                    if (signal){
                        this.signalOutputService.storeInCache(id, signal as SignalModel)
                    }
                }catch(error){
                    // TODO: handle multiple timeouts
                    console.error("updateSignals id: " + id + " port: " + signalConfig.port + " token: " + token + " error: ", error)
                }
            }
        }
    }
    
    private async updateSignalsOutput()
    {
        const ids = this.signalOutputService.getAllSignals()
        for(const id of ids){
            for(const token of this.signalOutputService.getSignalTokens(id)){
                const signal = this.signalOutputService.updateSignal(id, token)

                this.signalOutputService.storeInCache(id, signal)
                await this.wsOutputService.sendUpdate(id, token, signal.action)
            }
        }
    }
}
