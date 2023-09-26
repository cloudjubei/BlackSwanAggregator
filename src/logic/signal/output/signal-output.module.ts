import { Module } from '@nestjs/common'
import { SignalOutputService } from './signal-output.service'
import { SignalOutputController } from './signal-output.controller'

@Module({
    controllers: [SignalOutputController],
    providers: [SignalOutputService],
    exports: [SignalOutputService],
})
export class SignalOutputModule {}
