import { Module } from '@nestjs/common'
import { WSCommonModule } from '../common/ws-common.module'
import { WSIdentityGateway } from './ws-identity.gateway'
import { IdentityModule } from 'src/logic/identity/identity.module'

@Module({
    imports: [WSCommonModule, IdentityModule],
    providers: [WSIdentityGateway],
})
export class WSIdentityModule {}