import { Module } from '@nestjs/common'
import { WSOutputModule } from '../websockets/output/ws-output.module'
import { IdentityModule } from '../identity/identity.module'
import { SignalService } from './signal.service'
import { SignalOutputModule } from './output/signal-output.module'
import { WSInputModule } from '../websockets/input/ws-input.module'

@Module({
    imports: [
        IdentityModule,
        SignalOutputModule,

        WSInputModule,
        WSOutputModule
    ],
    providers: [SignalService],
    exports: [SignalService],
})
export class SignalModule {}