import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { cwd, exit } from "node:process";
import { cancel } from "@clack/prompts";

export function resolveNewDir(projectName: string): string {
    const targetDir = resolve(cwd(), projectName);

    return existsSync(targetDir)
        ? abortWithMessage(`Directory already exists: ${targetDir}`)
        : targetDir;
}

function abortWithMessage(message: string): never {
    cancel(message);
    exit(1);
}
