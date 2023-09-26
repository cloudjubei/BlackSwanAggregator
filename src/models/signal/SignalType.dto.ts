enum SignalType
{
    SUM = 'SUM',
    AVERAGE = 'AVERAGE',
    MINIMUM = 'MINIMUM',
    MAXIMUM = 'MAXIMUM'
}
export default SignalType

export const SignalTypeAPI = { enum: SignalType, enumName: 'SignalType' }
