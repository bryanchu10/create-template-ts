import type { TemplateConfig } from "@/constants";
import type { PackageJson } from "@/types";
import { existsSync } from "node:fs";
import { basename, join } from "node:path";
import { exit, version } from "node:process";
import { cancel, intro, outro, spinner } from "@clack/prompts";
import { ok, ResultAsync } from "neverthrow";
import { TEMPLATES } from "@/constants";
import { getProjectName, getTemplate, makeResolver, resolveNewDir, safeCpSync, safeJsonParse, safeMkdirSync, safeReadFileSync, safeRenameSync, safeWriteFileSync, sortKeys } from "@/utils";

void (async () => {
    intro("create-template-ts");

    await getProjectName()
        .andThen(projectName =>
            getTemplate().map(template => ({ projectName, template })),
        )
        .andThen(({ projectName, template }) =>
            resolveNewDir(projectName).map(targetDir => ({ projectName, template, targetDir })),
        )
        .andThen(({ projectName, template, targetDir }) => {
            const { withPeerDependencies, deps, devDeps, pinnedVersions } = TEMPLATES[template] as TemplateConfig;
            const resolveVer = makeResolver(pinnedVersions);

            const s = spinner();
            s.start("Fetching latest package versions");

            return ResultAsync.combine([
                ResultAsync.combine([...deps].map(resolveVer)),
                ResultAsync.combine([...devDeps].map(resolveVer)),
            ])
                .map(([depEntries, devDepEntries]) => {
                    s.stop("Fetched latest package versions");

                    return { projectName, template, targetDir, withPeerDependencies, depEntries, devDepEntries };
                })
                .mapErr((error) => {
                    s.stop("Failed to fetch package versions");

                    return error;
                });
        })
        .andThen(({ projectName, template, targetDir, withPeerDependencies, depEntries, devDepEntries }) => {
            const depsMap = Object.fromEntries(depEntries);
            const devDepsMap = {
                ...Object.fromEntries(devDepEntries),
                "@types/node": `^${version.match(/^v(\d+)/)?.[1]}`,
            };

            const templateDir = join(import.meta.dirname, "../templates", template);
            const pkgPath = join(targetDir, "package.json");

            return safeMkdirSync(targetDir, { recursive: true })
                .andThen(() => safeCpSync(templateDir, targetDir))
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
                .andThen(content => safeJsonParse<PackageJson>(content))
                .andThen((pkg) => {
                    pkg.name = basename(projectName);
                    pkg.dependencies = depsMap;
                    Object.assign(pkg, withPeerDependencies
                        ? { peerDependencies: Object.fromEntries(
                                Object.entries(depsMap).map(([dep, ver]) => [dep, ver.replace(/^(\^?\d+)\..*$/, "$1")]),
                            ) }
                        : {});
                    pkg.devDependencies = devDepsMap;

                    const { name, dependencies, peerDependencies, devDependencies, ...rest } = pkg;
                    const ordered = {
                        name,
                        ...rest,
                        ...(peerDependencies ? { peerDependencies: sortKeys(peerDependencies) } : {}),
                        dependencies: sortKeys(dependencies),
                        devDependencies: sortKeys(devDependencies),
                    };

                    return safeWriteFileSync(pkgPath, `${JSON.stringify(ordered, null, 4)}\n`);
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
