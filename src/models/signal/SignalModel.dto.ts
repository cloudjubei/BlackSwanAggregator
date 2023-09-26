import { ApiProperty } from "@nestjs/swagger"
import { Timestamp } from "../swagger.consts"

export default class SignalModel
{
    @ApiProperty() tokenPair: string
    @ApiProperty() action: number
    @ApiProperty(Timestamp) timestamp: number
    @ApiProperty() certainty: number = 1.0 // percentage

    constructor(tokenPair: string, action: number, timestamp: number, certainty: number = 1.0)
    {
        this.tokenPair = tokenPair
        this.action = action
        this.timestamp = timestamp
        this.certainty = certainty
    }
}