import { Module } from '@nestjs/common'
import { SignalInputService } from './signal-input.service'

@Module({
    providers: [SignalInputService],
    exports: [SignalInputService],
})
export class SignalInputModule {}
