import { fromThrowable } from "neverthrow";

export function safeJsonParse<T = unknown>(text: string) {
    return fromThrowable(
        (t: string) => JSON.parse(t) as T,
        e => e as Error,
    )(text);
}
