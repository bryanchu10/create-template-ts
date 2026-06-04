import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { exit, version } from "node:process";
import { cancel, intro, outro, spinner } from "@clack/prompts";
import { fromThrowable, ok, Result } from "neverthrow";
import { DEPS, DEV_DEPS } from "@/constants";
import { getLatestVer, getProjectName, resolveNewDir } from "./utils";

(async () => {
    intro("create-template-ts");

    const projectName = await getProjectName();
    const targetDir = resolveNewDir(projectName);

    const s = spinner();
    s.start("Fetching latest package versions");

    const [depResults, devDepResults] = await Promise.all([
        Promise.all(DEPS.map(dep => getLatestVer(dep))),
        Promise.all(DEV_DEPS.map(dep => getLatestVer(dep))),
    ]);

    Result.combine(depResults)
        .andThen(depVers => Result.combine(devDepResults).map(devDepVers => ({ depVers, devDepVers })))
        .match(
            ({ depVers, devDepVers }) => {
                s.stop("Fetched latest package versions");

                const deps = Object.fromEntries(DEPS.map((dep, i) => [dep, depVers[i]]));
                const devDeps = {
                    ...Object.fromEntries(DEV_DEPS.map((dep, i) => [dep, devDepVers[i]])),
                    "@types/node": `^${version.match(/^v(\d+)/)?.[1]}`,
                };

                const templateDir = join(import.meta.dirname, "../template");
                const pkgPath = join(targetDir, "package.json");

                safeMkdirSync(targetDir, { recursive: true })
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
                    })
                    .match(
                        () => outro(`Done! Run:\n\n  cd ${projectName}\n  pnpm install`),
                        (err) => {
                            cancel(err.message);
                            exit(1);
                        },
                    );
            },
            (err) => {
                s.stop("Failed to fetch package versions");
                cancel(err.message);
                exit(1);
            },
        );
})();

function safeMkdirSync(path: string, options: { recursive: true }) {
    return fromThrowable(mkdirSync, e => e as Error)(path, options);
}

function safeCpSync(src: string, dest: string, options: { recursive: true }) {
    return fromThrowable(cpSync, e => e as Error)(src, dest, options);
}

function safeRenameSync(oldPath: string, newPath: string) {
    return fromThrowable(renameSync, e => e as Error)(oldPath, newPath);
}

function safeReadFileSync(path: string) {
    return fromThrowable((p: string) => readFileSync(p, "utf8"), e => e as Error)(path);
}

function safeWriteFileSync(path: string, data: string) {
    return fromThrowable(writeFileSync, e => e as Error)(path, data);
}

interface PackageJson {
    name: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}

function safeJsonParse(text: string) {
    return fromThrowable((t: string) => JSON.parse(t) as PackageJson, e => e as Error)(text);
}
