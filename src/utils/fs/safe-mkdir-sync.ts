import { mkdirSync } from "node:fs";
import { fromThrowable } from "neverthrow";

export function safeMkdirSync(path: string, options: { recursive: true }) {
    return fromThrowable(mkdirSync, e => e as Error)(path, options);
}
