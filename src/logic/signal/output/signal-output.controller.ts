import { Controller, Get, Param, Req, UseGuards, Post, Body, Query } from '@nestjs/common'
import { ApiQuery, ApiTags } from "@nestjs/swagger"
import SignalModel from 'src/models/signal/SignalModel.dto'
import { SignalOutputService } from './signal-output.service'

@ApiTags("signal")
@Controller("signal")
export class SignalOutputController
{
    constructor(private readonly signalOutputService: SignalOutputService) {}

    @Get('latest/:id/:tokenPair')
    async getLatest(@Param('id') id: string, @Param('tokenPair') tokenPair: string) : Promise<SignalModel>
    {
        return await this.signalOutputService.getLatest(id, tokenPair)
    }
}