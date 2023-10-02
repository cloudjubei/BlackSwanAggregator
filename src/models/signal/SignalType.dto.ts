enum SignalType
{
    SUM = 'SUM',
    AVERAGE = 'AVERAGE',
    MINIMUM = 'MINIMUM',
    MAXIMUM = 'MAXIMUM',
    MULTIPLY = 'MULTIPLY',
    NEGATE = 'NEGATE',
    CONSTANT_MULTIPLY = 'CONSTANT_MULTIPLY',
    CONSTANT_OFFSET = 'CONSTANT_OFFSET'
}
export default SignalType

export const SignalTypeAPI = { enum: SignalType, enumName: 'SignalType' }
