import { Module } from '@nestjs/common'
import { WebsocketsService } from './ws-common.service'

@Module({
    providers: [WebsocketsService],
    exports: [WebsocketsService]
})
export class WSCommonModule {}