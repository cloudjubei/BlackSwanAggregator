
export const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000

export default class DateUtils
{
    static GetDateString(date: Date) : string
    {
        return `${date.getUTCFullYear()}-${DateUtils.PrependDateZero(date.getUTCMonth() + 1)}-${DateUtils.PrependDateZero(date.getUTCDate())}`
    }

    static GetReferenceDate(date: Date) : Date
    {
        const dateString = DateUtils.GetReferenceDateString(date)
        return new Date(dateString)
    }
    static GetReferenceDateString(date: Date) : string
    {
        return `${date.getUTCFullYear()}-${DateUtils.PrependDateZero(date.getUTCMonth() + 1)}-${DateUtils.PrependDateZero(date.getUTCDate())}T12:00:00.000Z`
    }
    static PrependDateZero(n: number) : string
    {
        return n > 9 ? "" + n : "0" + n
    }
    static GetDifferenceInDays(date1: Date, date2: Date) : number
    {
        const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate())
        const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate())
        return Math.floor((utc2 - utc1) / DAY_IN_MILLISECONDS)
    }

    static AddDays(date: Date, days: number) : Date
    {
        return new Date(date.valueOf() + (DAY_IN_MILLISECONDS * days))
    }
}