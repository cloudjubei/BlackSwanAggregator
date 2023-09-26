import { Module } from '@nestjs/common'
import { WSCommonModule } from './common/ws-common.module'
import { WebsocketsGateway } from './websockets.gateway'
import { WSTimesyncModule } from './timesync/ws-timesync.module'
import { WSIdentityModule } from './identity/ws-identity.module'
import { WSInputModule } from './input/ws-input.module'
import { WSOutputModule } from './output/ws-output.module'

@Module({
    imports: [
        WSCommonModule,

        WSTimesyncModule,
        
        WSIdentityModule,
        WSInputModule,
        WSOutputModule
    ],
    providers: [WebsocketsGateway]
})
export class WebsocketsModule {}