export function sortKeys(obj: Record<string, string> | undefined) {
    return obj && Object.fromEntries(Object.keys(obj).sort().map((k) => [k, obj[k]]));
}
