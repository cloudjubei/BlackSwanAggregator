import { ApiProperty } from "@nestjs/swagger"
import { Timestamp } from "../swagger.consts"

export default class TokenIndicatorsModel
{
    @ApiProperty() tokenPair: string
    @ApiProperty() interval: string
    @ApiProperty() price: string
    @ApiProperty(Timestamp) timestamp: number
    @ApiProperty() indicators: { [id:string] : string }

    constructor(tokenPair: string, interval: string, price: string, timestamp: number, indicators: {[id:string] : string}){
        this.tokenPair = tokenPair
        this.interval = interval
        this.price = price
        this.timestamp = timestamp
        this.indicators = indicators
    }
}