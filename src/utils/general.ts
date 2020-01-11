export function hasValue(d: any): boolean {
    return d !== null && d !== undefined;
}

export function dropKey<T extends { [index: string]: any }, S extends string>(
    obj: T,
    key: S,
): { [index: string]: any } {
    const output = {} as { [index: string]: any };
    Object.keys(obj).forEach(_key => {
        if (_key !== key) output[_key] = obj[_key];
    });
    return output;
}
