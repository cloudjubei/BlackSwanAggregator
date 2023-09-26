import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MissingModelsController } from './models/missingModels.controller'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import { WebsocketsModule } from './logic/websockets/websockets.module'
import { IdentityModule } from './logic/identity/identity.module'
import { SignalModule } from './logic/signal/signal.module'

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: ".env.local", isGlobal: true }),

        WebsocketsModule,

        IdentityModule,
        SignalModule,
        
        ScheduleModule.forRoot()
    ],
    controllers: [
        AppController,
        MissingModelsController
    ]
})
export class AppModule implements NestModule
{
  configure(consumer: MiddlewareConsumer)
  {
    consumer
  }
}
