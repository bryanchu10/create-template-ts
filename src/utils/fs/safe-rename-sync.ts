import { renameSync } from "node:fs";
import { fromThrowable } from "neverthrow";

export function safeRenameSync(oldPath: string, newPath: string) {
    return fromThrowable(renameSync, e => (e instanceof Error ? e : new Error(String(e))))(oldPath, newPath);
}
