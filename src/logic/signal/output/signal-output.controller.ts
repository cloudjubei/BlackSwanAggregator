import { Controller, Get, Param, Req, UseGuards, Post, Body, Query } from '@nestjs/common'
import { ApiQuery, ApiTags } from "@nestjs/swagger"
import { SignalOutputService } from './signal-output.service'
import SignalModel from 'commons/models/signal/SignalModel.dto'

@ApiTags("signal")
@Controller("signal")
export class SignalOutputController
{
    constructor(private readonly signalOutputService: SignalOutputService) {}

    @Get('latest/:id/:tokenPair/:interval')
    async getLatest(@Param('id') id: string, @Param('tokenPair') tokenPair: string, @Param('interval') interval: string) : Promise<SignalModel>
    {
        return await this.signalOutputService.getLatest(id, tokenPair, interval)
    }
}