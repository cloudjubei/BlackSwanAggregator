export default class ConfigSignalOutputModel
{
    tokens: string[];
    intervals: string[];
    inputs: string[]
    
    operation: string

    resets_every_tick: boolean = false
    resets_every_tick_for_all: boolean = false
    // samples_required: number = 1
}