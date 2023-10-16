import { Module } from '@nestjs/common'
import { SignalOutputService } from './signal-output.service'
import { SignalOutputController } from './signal-output.controller'
import { IdentityModule } from 'logic/identity/identity.module'

@Module({
    imports: [
        IdentityModule
    ],
    controllers: [SignalOutputController],
    providers: [SignalOutputService],
    exports: [SignalOutputService],
})
export class SignalOutputModule {}
