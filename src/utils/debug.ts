import debugPkg from "debug";

export function createDebug(name: string) {
    return debugPkg(`rx-form:${name}`);
}
