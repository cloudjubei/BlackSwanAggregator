import BigNumber from "bignumber.js"

export default class MathUtils
{
    static Shorten(val1: string) : string
    {
        const n = new BigNumber(val1)
        return n.decimalPlaces(2).toString()
    }

    static Abs(val1: string) : string
    {
        const n = new BigNumber(val1)
        return n.abs().toString()
    }

    static AddNumbers(val1: string, val2: string) : string
    {
        const n1 = new BigNumber(val1)
        const n2 = new BigNumber(val2)
        return n1.plus(n2).toString()
    }
    static AddManyNumbers(vals: string[]) : string
    {
        return vals.reduce((acc, val) => MathUtils.AddNumbers(acc, val), "0.0")
    }

    static SubtractNumbers(val1: string, val2: string) : string
    {
        const n1 = new BigNumber(val1)
        const n2 = new BigNumber(val2)
        return n1.minus(n2).toString()
    }

    static MultiplyNumbers(val1: string, val2: string) : string
    {
        const n1 = new BigNumber(val1)
        const n2 = new BigNumber(val2)
        return n1.multipliedBy(n2).toString()
    }

    static DivideNumbers(val1: string, val2: string) : string
    {
        const n1 = new BigNumber(val1)
        const n2 = new BigNumber(val2)
        return n1.dividedBy(n2).toString()
    }
    static Pow(val: string, pow: string) : string
    {
        const n = new BigNumber(val)
        const power = new BigNumber(pow)
        return n.pow(power).toString()
    }

    static IsZero(val: string) : boolean
    {
        const n = new BigNumber(val)
        return n.isZero()
    }

    static IsNegative(val: string) : boolean
    {
        const n = new BigNumber(val)
        return n.isNegative()
    }

    static IsNumber(val: string) : boolean
    {
        const n = new BigNumber(val)
        return !n.isNaN()
    }

    static IsBiggerThanZero(val: string) : boolean
    {
        const n = new BigNumber(val)
        return !n.isNegative() && !n.isZero()
    }

    static IsLessThanZero(val: string) : boolean
    {
        const n = new BigNumber(val)
        return n.isNegative() && !n.isZero()
    }

    static IsEqual(val1: string, val2: string) : boolean
    {
        const n1 = new BigNumber(val1)
        const n2 = new BigNumber(val2)
        return n1.isEqualTo(n2)
    }

    static IsGreaterThan(val1: string, val2: string) : boolean
    {
        const n1 = new BigNumber(val1)
        const n2 = new BigNumber(val2)
        return n1.isGreaterThan(n2)
    }

    static IsGreaterThanOrEqualTo(val1: string, val2: string) : boolean
    {
        const n1 = new BigNumber(val1)
        const n2 = new BigNumber(val2)
        return n1.isGreaterThanOrEqualTo(n2)
    }

    static IsLessThan(val1: string, val2: string) : boolean
    {
        const n1 = new BigNumber(val1)
        const n2 = new BigNumber(val2)
        return n1.isLessThan(n2)
    }

    static IsLessThanOrEqualTo(val1: string, val2: string) : boolean
    {
        const n1 = new BigNumber(val1)
        const n2 = new BigNumber(val2)
        return n1.isLessThanOrEqualTo(n2)
    }

    static Max(val1: string, val2: string) : string
    {
        const n1 = new BigNumber(val1)
        const n2 = new BigNumber(val2)
        return BigNumber.max(n1, n2).toString()
    }

    static Min(val1: string, val2: string) : string
    {
        const n1 = new BigNumber(val1)
        const n2 = new BigNumber(val2)
        return BigNumber.min(n1, n2).toString()
    }
}