export default class ObjectUtils
{
    static MapObject<T>(object: any, mapFunc: (key: any, value: any) => T) : T[]
    {
        const result = []
        for (let [key, value] of Object.entries(object)){
            result.push(mapFunc(key, value))
        }
        return result
    }
}