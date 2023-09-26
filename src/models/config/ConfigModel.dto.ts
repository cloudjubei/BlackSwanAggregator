import ConfigSignalInputModel from "./ConfigSignalInputModel.dto"
import ConfigSignalOutputModel from "./ConfigSignalOutputModel.dto"

export default class ConfigModel
{
    type: string = "price"
    identifier: string = "test"
    tokens: string[] = []
    identifiers_out: string[] = []

    signals_input: { [key:string] : ConfigSignalInputModel } = {}
    signals_output: { [key:string] : ConfigSignalOutputModel } = {}
}