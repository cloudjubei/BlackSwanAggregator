export default class ArrayUtils
{
    static RandomElement<T>(array: T[]) : T
    {
        return array[(Math.random() * array.length) | 0]
    }

    static RemoveElement<T>(array: T[], element: T) : T[]
    {
        return array.filter(e => e !== element)
    }

    static FirstElement<T>(array: T[], where: ((element: T) => boolean)) : T
    {
        return array.find(e => where(e))
    }
    
    static LastElement<T>(array: T[]) : T
    {
        return array[array.length-1]
    }

    static ContainsElement<T>(array: T[], element: T) : boolean
    {
        const e = JSON.stringify(element)
        let i = array.length
        while (i--) {
           if (JSON.stringify(array[i]) === e) {
               return true
           }
        }
        return false
    }
    
    static DropLast<T>(array: T[], count: number) : T[]
    {
        const dropAmount = Math.min(count, array.length)
        if (dropAmount <= 0) { return array }
        return array.slice(0, -dropAmount)
    }

    static FilterElementsWhere<T>(array: T[], where: (element: T) => boolean, count: number) : T[]
    {
        let c = count
        let outArray = []
        for (let i=0; i<array.length; i++){
            const e = array[i]
            if (c <= 0 || !where(e) ){
                outArray.push(e)
            }else{
                c--
            }
        }
        return outArray
    }

    static GenerateCombinations<T>(array: T[], comboLength: number) : T[][]
    {
        const sourceLength = array.length
        if (comboLength > sourceLength) return []
  
        const combos = []
  
        const makeNextCombos = (workingCombo, currentIndex, remainingCount) => {
            const oneAwayFromComboLength = remainingCount == 1
    
            for (let i = currentIndex; i < sourceLength; i++)
            {
                const next = [ ...workingCombo, array[i] ]
        
                if (oneAwayFromComboLength) {
                    combos.push(next)
                } else {
                    makeNextCombos(next, i + 1, remainingCount - 1)
                }
            }
        }
    
        makeNextCombos([], 0, comboLength)

        return combos
    }
}