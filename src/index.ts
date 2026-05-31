import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { exit, version } from "node:process";
import { intro, outro, spinner } from "@clack/prompts";
import { DEPS, DEV_DEPS } from "@/constants";
import { getLatestVer, getProjectName, resolveNewDir } from "./utils";

interface PackageJson {
    name: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}

async function main() {
    intro("create-template-ts");

    const projectName = await getProjectName();

    const targetDir = resolveNewDir(projectName);

    const s = spinner();
    s.start("Fetching latest package versions");

    const [depVers, devDepVers] = await Promise.all([
        Promise.all(DEPS.map(async dep => [dep, await getLatestVer(dep)])),
        Promise.all(DEV_DEPS.map(async dep => [dep, await getLatestVer(dep)])),
    ]);

    const deps = {
        ...Object.fromEntries(depVers),
    };

    const devDeps = {
        ...Object.fromEntries(devDepVers),
        "@types/node": `^${version.match(/^v(\d+)/)?.[1]}`,
    };

    s.stop("Fetched latest package versions");

    const templateDir = join(import.meta.dirname, "../template");
    mkdirSync(targetDir, { recursive: true });
    cpSync(templateDir, targetDir, { recursive: true });

    const gitignoreSrc = join(targetDir, "_gitignore");
    const gitignoreDst = join(targetDir, ".gitignore");

    if (existsSync(gitignoreSrc)) {
        renameSync(gitignoreSrc, gitignoreDst);
    }

    const vscodeSrc = join(targetDir, "_vscode");
    const vscodeDst = join(targetDir, ".vscode");

    if (existsSync(vscodeSrc)) {
        renameSync(vscodeSrc, vscodeDst);
    }

    const pkgPath = join(targetDir, "package.json");
    const pkg: PackageJson = JSON.parse(readFileSync(pkgPath, "utf8"));
    pkg.name = basename(projectName);
    pkg.dependencies = deps;
    pkg.devDependencies = devDeps;
    writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 4)}\n`);

    outro(`Done! Run:\n\n  cd ${projectName}\n  pnpm install`);
}

main()
    .catch((err) => {
        console.error(err);
        exit(1);
    });
