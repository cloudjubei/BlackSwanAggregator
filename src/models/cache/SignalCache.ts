import SignalModel from "../signal/SignalModel.dto"
import { ACache } from "./ACache"

export class SignalCache extends ACache<SignalModel>
{
    storeSignal(value: SignalModel)
    {
        const latest = this.getLatest(value.tokenPair, value.interval)
        if (latest.timestamp < value.timestamp){
            super.store(value.tokenPair, value.interval, value)   
        }else{
            this.cache[value.tokenPair][value.interval][0] = value
        }
    }

    getLatest(tokenPair: string, interval: string) : SignalModel
    {
        return super.getLatest(tokenPair, interval) ?? new SignalModel(tokenPair, interval, Date.now(), 0)
    }
}
