import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { exit, version } from "node:process";
import { cancel, intro, outro, spinner } from "@clack/prompts";
import { fromThrowable, ok, Result } from "neverthrow";
import { DEPS, DEV_DEPS } from "@/constants";
import { getLatestVer, getProjectName, resolveNewDir } from "./utils";

interface PackageJson {
    name: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}

const safeMkdirSync = fromThrowable(mkdirSync, e => e as Error);
const safeCpSync = fromThrowable(cpSync, e => e as Error);
const safeRenameSync = fromThrowable(renameSync, e => e as Error);
const safeReadFileSync = fromThrowable(
    (path: string) => readFileSync(path, "utf8"),
    e => e as Error,
);
const safeWriteFileSync = fromThrowable(writeFileSync, e => e as Error);
const safeJsonParse = fromThrowable(
    (text: string) => JSON.parse(text) as PackageJson,
    e => e as Error,
);

async function main() {
    intro("create-template-ts");

    const projectName = await getProjectName();
    const targetDir = resolveNewDir(projectName);

    const s = spinner();
    s.start("Fetching latest package versions");

    const [depResults, devDepResults] = await Promise.all([
        Promise.all(DEPS.map(dep => getLatestVer(dep))),
        Promise.all(DEV_DEPS.map(dep => getLatestVer(dep))),
    ]);

    const depVerResults = Result.combine(depResults);
    const devDepVerResults = Result.combine(devDepResults);

    if (depVerResults.isErr()) {
        s.stop("Failed to fetch package versions");
        cancel(depVerResults.error.message);
        exit(1);
    }

    if (devDepVerResults.isErr()) {
        s.stop("Failed to fetch package versions");
        cancel(devDepVerResults.error.message);
        exit(1);
    }

    s.stop("Fetched latest package versions");

    const deps = Object.fromEntries(DEPS.map((dep, i) => [dep, depVerResults.value[i]]));
    const devDeps = {
        ...Object.fromEntries(DEV_DEPS.map((dep, i) => [dep, devDepVerResults.value[i]])),
        "@types/node": `^${version.match(/^v(\d+)/)?.[1]}`,
    };

    const templateDir = join(import.meta.dirname, "../template");
    const pkgPath = join(targetDir, "package.json");

    const result = safeMkdirSync(targetDir, { recursive: true })
        .andThen(() => safeCpSync(templateDir, targetDir, { recursive: true }))
        .andThen(() => {
            const src = join(targetDir, "_gitignore");
            const dst = join(targetDir, ".gitignore");

            return existsSync(src) ? safeRenameSync(src, dst) : ok(undefined);
        })
        .andThen(() => {
            const src = join(targetDir, "_vscode");
            const dst = join(targetDir, ".vscode");

            return existsSync(src) ? safeRenameSync(src, dst) : ok(undefined);
        })
        .andThen(() => safeReadFileSync(pkgPath))
        .andThen(content => safeJsonParse(content))
        .andThen((pkg) => {
            pkg.name = basename(projectName);
            pkg.dependencies = deps;
            pkg.devDependencies = devDeps;

            return safeWriteFileSync(pkgPath, `${JSON.stringify(pkg, null, 4)}\n`);
        });

    if (result.isErr()) {
        cancel(result.error.message);
        exit(1);
    }

    outro(`Done! Run:\n\n  cd ${projectName}\n  pnpm install`);
}

main();
