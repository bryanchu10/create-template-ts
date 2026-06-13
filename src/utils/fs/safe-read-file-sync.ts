import { readFileSync } from "node:fs";
import { fromThrowable } from "neverthrow";

export function safeReadFileSync(path: string) {
    return fromThrowable(
        (p: string) => readFileSync(p, "utf8"),
        e => e as Error,
    )(path);
}
