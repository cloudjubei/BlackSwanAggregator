

const OPERATION_REGEX_OUTSIDE = /\((.*)\)/ //finds first outside ()
const OPERATION_REGEX_PARTS = /(?:\([^\)\(\n]*\)|[^,|, \n])+/g

export default class SignalOperation
{
    functionName: string
    data: number = 0
    inputLeft?: SignalOperation = undefined
    inputRight?: SignalOperation = undefined
    extraArguments: string[] = []

    constructor(operation: string)
    {
        const results = operation.match(OPERATION_REGEX_OUTSIDE)
        let parts = []
        if (results){
            parts = results[1].match(OPERATION_REGEX_PARTS)
        }else{
            parts = operation.match(OPERATION_REGEX_PARTS)
        }

        if (parts.length == 0 || parts.length == 1){
            if (operation[0] == "$"){
                this.functionName = "REFERENCE"
                this.extraArguments = [operation.slice(1)]
                return
            }
            this.functionName = "CONST"
            this.data = parseFloat(operation)
            return
        }
        this.functionName = parts[0]
        this.inputLeft = new SignalOperation(parts[1])
        if (parts.length  > 2){
            this.inputRight = new SignalOperation(parts[2])
            this.extraArguments = [...parts.slice(3)]
        }
    }

    process(referenceValues: {[key: string]: number}) : number
    {
        const left = this.inputLeft?.process(referenceValues) ?? 0
        const right = this.inputRight?.process(referenceValues) ?? 0
        switch(this.functionName){
            case "NEGATE":
                return -left
            case "SUM":
                return left + right
            case "MULTIPLY":
                return left * right
            case "DIVIDE":
                return left / right
            case "MAX":
                return Math.max(left, right)
            case "MIN":
                return Math.min(left, right)
            case "REFERENCE":
                const reference = this.extraArguments[0] ?? ""
                return referenceValues[reference] ?? 0
            case "AND":
                return (left !== 0 && left === right) ? (parseFloat(this.extraArguments[0]) ?? 0) : (parseFloat(this.extraArguments[1]) ?? 0)
            case "OR":
                return (left !== 0 || right !== 0) ? (parseFloat(this.extraArguments[0]) ?? 0) : (parseFloat(this.extraArguments[1]) ?? 0)
            case "GREATERTHAN":
                return left > right ? (parseFloat(this.extraArguments[0]) ?? 0) : (parseFloat(this.extraArguments[1]) ?? 0)
            case "LESSTHAN":
                return left < right ? (parseFloat(this.extraArguments[0]) ?? 0) : (parseFloat(this.extraArguments[1]) ?? 0)
            default: // "CONST"
                return this.data
        }
    }
}