export class ACache<T>
{
    cache : { [key:string] : { [internalKey:string] : T[] }} = {}
    protected cacheSize = 10

    setup(keys: string[], internalKeys: string[], cacheSize: number)
    {
        this.cacheSize = cacheSize
        for(const key of keys){
            this.cache[key] = {}
            for(const internalKey of internalKeys){
                this.cache[key][internalKey] = []
            }
        }
    }
    setupValues(key: string, internalKey: string, values: T[])
    {
        this.cache[key][internalKey] = values.reverse()
    }

    store(key: string, internalKey: string, value: T)
    {
        this.cache[key][internalKey] = [value, ...this.cache[key][internalKey]]
        if (this.cache[key][internalKey].length > this.cacheSize){
            this.cache[key][internalKey].pop()
        }
    }

    getAllKeys() : string[]
    {
        return Object.keys(this.cache)
    }
    getAll(key: string, internalKey: string) : T[]
    {
        return this.cache[key][internalKey] ?? []
    }

    getLatest(key: string, internalKey: string) : T | undefined
    {
        const values = this.cache[key][internalKey]
        if (values.length > 0){
            return values[0]
        }
        return undefined
    }
}
