import ConfigSignalInputModel from 'commons/models/config/ConfigSignalInputModel.dto'
import ConfigSignalOutputModel from "./ConfigSignalOutputModel.dto"
import ConfigConnectionInputModel from 'commons/models/config/ConfigConnectionInputModel.dto'

export default class ConfigModel
{
    type: string = "signal"
    identifier: string = "aggregator"
    intervals: string[] = []
    indicators_input: string[] = []

    prices_input: { [token:string] : ConfigConnectionInputModel } = {}
    signals_input: { [id:string] : ConfigSignalInputModel } = {}
    signals_output: { [id:string] : ConfigSignalOutputModel } = {}
}