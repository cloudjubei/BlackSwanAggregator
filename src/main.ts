import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import swaggerConfig, { swaggerOptions } from "./spec/swaggerConfig"
import swaggerGenerate from "./spec/swaggerGenerate"

async function bootstrap()
{
    const app = await NestFactory.create(AppModule)
    app.enableCors()
    app.useGlobalPipes(new ValidationPipe())

    const document = SwaggerModule.createDocument(app, swaggerConfig(), swaggerOptions)
    swaggerGenerate(document)
    SwaggerModule.setup('swagger-ui', app, document)

    await app.listen(process.env.PORT ?? 3003)
}

bootstrap()
