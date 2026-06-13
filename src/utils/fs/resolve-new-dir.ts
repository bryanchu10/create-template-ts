import type { Result } from "neverthrow";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { cwd } from "node:process";
import { err, ok } from "neverthrow";

export function resolveNewDir(projectName: string): Result<string, Error> {
    const targetDir = resolve(cwd(), projectName);

    return !existsSync(targetDir)
        ? ok(targetDir)
        : err(new Error(`Directory already exists: ${targetDir}`));
}
