import { Module } from '@nestjs/common'
import { WSCommonModule } from '../common/ws-common.module'
import { WSOutputService } from './ws-output.service'
import { WSOutputGateway } from './ws-output.gateway'
import { SignalOutputModule } from 'src/logic/signal/output/signal-output.module'

@Module({
    imports: [
        WSCommonModule, 
        SignalOutputModule
    ],
    providers: [
        WSOutputGateway, 
        WSOutputService
    ],
    exports: [WSOutputService]
})
export class WSOutputModule {}