import SignalType from "../signal/SignalType.dto"

export default class ConfigSignalOutputModel
{
    type: SignalType
    signals: string[]
    tokens: string[]
    resets_every_tick: boolean = false
    resets_every_tick_for_all: boolean = false
    samples_required: number = 1
}