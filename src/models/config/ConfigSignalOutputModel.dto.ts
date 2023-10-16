export default class ConfigSignalOutputModel
{
    inputs: string[]
    tokens: string[]
    intervals: string[]
    
    operation: string

    resets_every_tick: boolean = false
    resets_every_tick_for_all: boolean = false
    // samples_required: number = 1
}