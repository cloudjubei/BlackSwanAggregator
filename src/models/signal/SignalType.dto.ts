enum SignalType
{
    SUM = 'SUM',
    AVERAGE = 'AVERAGE',
    MINIMUM = 'MINIMUM',
    MAXIMUM = 'MAXIMUM',
    NEGATE = 'NEGATE'
}
export default SignalType

export const SignalTypeAPI = { enum: SignalType, enumName: 'SignalType' }
