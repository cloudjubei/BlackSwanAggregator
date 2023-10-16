import ConfigSignalInputModel from "./ConfigSignalInputModel.dto"
import ConfigSignalOutputModel from "./ConfigSignalOutputModel.dto"

export default class ConfigModel
{
    type: string = "signal"
    identifier: string = "aggregator"
    intervals: string[] = []
    indicators_input: string[] = []

    prices_input: { [token:string] : number } = {}
    signals_input: { [id:string] : ConfigSignalInputModel } = {}
    signals_output: { [id:string] : ConfigSignalOutputModel } = {}
}