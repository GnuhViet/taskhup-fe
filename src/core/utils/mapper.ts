export function mapObject<T>(source: any, target: any) : T {
    const resp = {} as T
    Object.keys(target).forEach(key => {
        if (key in source) {
            // @ts-ignore
            resp[key] = source[key]
        }
    })

    return resp
}