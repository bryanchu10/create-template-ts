import { cpSync } from "node:fs";
import { fromThrowable } from "neverthrow";

export function safeCpSync(src: string, dest: string) {
    return fromThrowable(
        (s: string, d: string) => cpSync(s, d, { recursive: true }),
        e => e as Error,
    )(src, dest);
}
