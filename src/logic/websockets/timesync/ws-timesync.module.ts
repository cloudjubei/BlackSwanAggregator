import { Module } from '@nestjs/common'
import { WSTimesyncGateway } from './ws-timesync.gateway'

@Module({
  providers: [WSTimesyncGateway]
})
export class WSTimesyncModule {}