import { writeFileSync } from "node:fs";
import { fromThrowable } from "neverthrow";

export function safeWriteFileSync(path: string, data: string) {
    return fromThrowable(writeFileSync, (e) => (e instanceof Error ? e : new Error(String(e))))(path, data);
}
