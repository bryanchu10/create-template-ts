import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { cwd, exit } from "node:process";
import { cancel } from "@clack/prompts";

function resolveNewDir(projectName: string): string {
    const targetDir = resolve(cwd(), projectName);

    if (existsSync(targetDir)) {
        cancel(`Directory already exists: ${targetDir}`);
        exit(1);
    }

    return targetDir;
}

export {
    resolveNewDir,
};
