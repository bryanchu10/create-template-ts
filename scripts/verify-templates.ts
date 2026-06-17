import type { TemplateConfig } from "@/constants";
import type { PackageJson } from "@/types";
import { mkdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { exit, version } from "node:process";
import { ResultAsync } from "neverthrow";
import { TEMPLATES } from "@/constants";
import { makeResolver, safeCpSync, safeExecSync, safeJsonParse, safeReadFileSync, safeWriteFileSync, sortKeys } from "@/utils";

const rootDir = resolve(import.meta.dirname, "..");
const tmpBase = join(rootDir, ".verify-tmp");

void (async () => {
    rmSync(tmpBase, { recursive: true, force: true });
    mkdirSync(tmpBase);

    const results = await Promise.all(
        (Object.entries(TEMPLATES) as [string, TemplateConfig][]).map(([templateName, config]) => {
            console.log(`\n▶ Verifying ${templateName}...`);

            const targetDir = join(tmpBase, templateName);
            const templateDir = join(rootDir, "templates", templateName);
            const { deps, devDeps, pinnedVersions } = config;
            const resolveVersion = makeResolver(pinnedVersions);
            const pkgPath = join(targetDir, "package.json");

            return safeCpSync(templateDir, targetDir)
                .asyncAndThen(() => ResultAsync.combine([
                    ResultAsync.combine([...deps].map(resolveVersion)),
                    ResultAsync.combine([...devDeps].map(resolveVersion)),
                ]))
                .andThen(([depEntries, devDepEntries]) =>
                    safeReadFileSync(pkgPath)
                        .andThen(content => safeJsonParse<PackageJson>(content))
                        .andThen((pkg) => {
                            const { name: _n, dependencies: _d, devDependencies: _dd, ...rest } = pkg;
                            const ordered = {
                                name: templateName,
                                ...rest,
                                dependencies: sortKeys(Object.fromEntries(depEntries)),
                                devDependencies: sortKeys({
                                    ...Object.fromEntries(devDepEntries),
                                    "@types/node": `^${version.match(/^v(\d+)/)?.[1]}`,
                                }),
                            };

                            return safeWriteFileSync(pkgPath, `${JSON.stringify(ordered, null, 4)}\n`);
                        }),
                )
                .andThen(() => safeExecSync("pnpm install", { cwd: targetDir, stdio: "inherit" }))
                .andThen(() => safeExecSync("pnpm check", { cwd: targetDir, stdio: "inherit" }))
                .andThen(() => safeExecSync("pnpm exec eslint --ignore-pattern pnpm-workspace.yaml", { cwd: targetDir, stdio: "inherit" }))
                .map(() => console.log(`  ✓ ${templateName} OK`))
                .mapErr((err) => {
                    console.error(`  ✗ ${templateName} FAILED: ${err.message}`);

                    return err;
                });
        }),
    );

    rmSync(tmpBase, { recursive: true });

    if (results.some(r => r.isErr()))
        exit(1);
})();
