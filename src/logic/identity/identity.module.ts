import { Module } from '@nestjs/common'
import { IdentityService } from './identity.service'
import { IdentityController } from './identity.controller'

@Module({
    controllers: [IdentityController],
    providers: [IdentityService],
    exports: [IdentityService],
})
export class IdentityModule {}
