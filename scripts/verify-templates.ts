import type { TemplateConfig } from "@/constants";
import { execSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { exit, version } from "node:process";
import { fromThrowable, okAsync, ResultAsync } from "neverthrow";
import { TEMPLATES } from "@/constants";
import { getLatestVer } from "@/utils";

const rootDir = resolve(import.meta.dirname, "..");
const tmpBase = join(rootDir, ".verify-tmp");

rmSync(tmpBase, { recursive: true, force: true });
mkdirSync(tmpBase);

const results = await Promise.all(
    (Object.entries(TEMPLATES) as [string, TemplateConfig][]).map(verifyTemplate),
);

rmSync(tmpBase, { recursive: true });

if (results.some(r => r.isErr()))
    exit(1);

// --- functions ---

function verifyTemplate([templateName, config]: [string, TemplateConfig]): ResultAsync<void, Error> {
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
                .andThen(content => safeJsonParse(content))
                .andThen(pkg => safeWriteFileSync(pkgPath, `${JSON.stringify({
                    ...(pkg as Record<string, unknown>),
                    name: templateName,
                    dependencies: Object.fromEntries(depEntries),
                    devDependencies: {
                        ...Object.fromEntries(devDepEntries),
                        "@types/node": `^${version.match(/^v(\d+)/)?.[1]}`,
                    },
                }, null, 4)}\n`)),
        )
        .andThen(() => safeExecSync("pnpm install", { cwd: targetDir, stdio: "inherit" }))
        .andThen(() => safeExecSync("pnpm check", { cwd: targetDir, stdio: "inherit" }))
        .map(() => console.log(`  ✓ ${templateName} OK`))
        .mapErr((err) => {
            console.error(`  ✗ ${templateName} FAILED: ${err.message}`);

            return err;
        });
}

function makeResolver(pinnedVersions: Record<string, string> | undefined) {
    return (dep: string) => {
        const pinned = pinnedVersions?.[dep];

        return pinned ? okAsync([dep, pinned] as const) : getLatestVer(dep).map(ver => [dep, ver] as const);
    };
}

function safeCpSync(src: string, dest: string) {
    return fromThrowable(
        (s: string, d: string) => cpSync(s, d, { recursive: true }),
        e => e as Error,
    )(src, dest);
}

function safeReadFileSync(path: string) {
    return fromThrowable(
        (p: string) => readFileSync(p, "utf8"),
        e => e as Error,
    )(path);
}

function safeWriteFileSync(path: string, data: string) {
    return fromThrowable(
        (p: string, d: string) => writeFileSync(p, d),
        e => e as Error,
    )(path, data);
}

function safeExecSync(cmd: string, opts: { cwd: string; stdio: "inherit" }) {
    return fromThrowable(
        (c: string, o: { cwd: string; stdio: "inherit" }) => execSync(c, o),
        e => e as Error,
    )(cmd, opts);
}

function safeJsonParse(text: string) {
    return fromThrowable(
        (t: string): unknown => JSON.parse(t),
        e => e as Error,
    )(text);
}
