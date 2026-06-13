import { writeFileSync } from "node:fs";
import { fromThrowable } from "neverthrow";

export function safeWriteFileSync(path: string, data: string) {
    return fromThrowable(writeFileSync, e => e as Error)(path, data);
}
