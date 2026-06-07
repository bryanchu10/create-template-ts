import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { exit, version } from "node:process";
import { cancel, intro, outro, spinner } from "@clack/prompts";
import { fromThrowable, ok, ResultAsync } from "neverthrow";
import { TEMPLATES } from "@/constants";
import { getLatestVer, getProjectName, getTemplate, resolveNewDir } from "./utils";

(async () => {
    intro("create-template-ts");

    await getProjectName()
        .andThen(projectName =>
            getTemplate().map(template => ({ projectName, template })),
        )
        .andThen(({ projectName, template }) =>
            resolveNewDir(projectName).map(targetDir => ({ projectName, template, targetDir })),
        )
        .andThen(({ projectName, template, targetDir }) => {
            const { withPeerDependencies, deps, devDeps } = TEMPLATES[template];

            const s = spinner();
            s.start("Fetching latest package versions");

            return ResultAsync.combine([
                ResultAsync.combine([...deps].map(dep => getLatestVer(dep))),
                ResultAsync.combine([...devDeps].map(dep => getLatestVer(dep))),
            ])
                .map(([depVers, devDepVers]) => {
                    s.stop("Fetched latest package versions");

                    return { projectName, template, targetDir, withPeerDependencies, deps, devDeps, depVers, devDepVers };
                })
                .mapErr((error) => {
                    s.stop("Failed to fetch package versions");

                    return error;
                });
        })
        .andThen(({ projectName, template, targetDir, withPeerDependencies, deps, devDeps, depVers, devDepVers }) => {
            const depsMap = Object.fromEntries(deps.map((dep, i) => [dep, depVers[i]]));
            const devDepsMap = {
                ...Object.fromEntries(devDeps.map((dep, i) => [dep, devDepVers[i]])),
                "@types/node": `^${version.match(/^v(\d+)/)?.[1]}`,
            };

            const templateDir = join(import.meta.dirname, "../templates", template);
            const pkgPath = join(targetDir, "package.json");

            return safeMkdirSync(targetDir, { recursive: true })
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
                    pkg.dependencies = depsMap;
                    Object.assign(pkg, withPeerDependencies
                        ? { peerDependencies: Object.fromEntries(
                                Object.entries(depsMap).map(([dep, ver]) => [dep, ver.replace(/^(\^?\d+)\..*$/, "$1")]),
                            ) }
                        : {});
                    pkg.devDependencies = devDepsMap;

                    return safeWriteFileSync(pkgPath, `${JSON.stringify(pkg, null, 4)}\n`);
                })
                .map(() => projectName);
        })
        .match(
            projectName => outro(`Done! Run:\n\n  cd ${projectName}\n  pnpm install`),
            (err) => {
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
    peerDependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}

function safeJsonParse(text: string) {
    return fromThrowable((t: string) => JSON.parse(t) as PackageJson, e => e as Error)(text);
}
