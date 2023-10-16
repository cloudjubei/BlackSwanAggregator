import { ACache } from "./ACache"
import PriceKlineModel from "../price/PriceKlineModel.dto"

export class PriceCache extends ACache<PriceKlineModel>
{
    setupValues(token: string, interval: string, klines: PriceKlineModel[])
    {
        this.cache[token][interval] = klines.reverse()
    }
    
    storeKline(value: PriceKlineModel)
    {
        const latest = this.getLatest(value.tokenPair, value.interval)
        if (latest.timestamp_open < value.timestamp_open){
            super.store(value.tokenPair, value.interval, value)   
        }else{
            this.cache[value.tokenPair][value.interval][0] = value
        }
    }

    getLatest(tokenPair: string, interval: string) : PriceKlineModel
    {
        return super.getLatest(tokenPair, interval) ?? new PriceKlineModel(tokenPair, interval)
    }
}
