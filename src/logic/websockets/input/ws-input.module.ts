import { Module } from '@nestjs/common'
import { WSInputService } from './ws-input.service';

@Module({
    providers: [WSInputService],
    exports: [WSInputService],
})
export class WSInputModule {}
