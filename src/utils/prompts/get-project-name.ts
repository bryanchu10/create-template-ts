import type { ResultAsync } from "neverthrow";
import { argv } from "node:process";
import { isCancel, text } from "@clack/prompts";
import { err, fromPromise, ok, okAsync } from "neverthrow";
import { match, P } from "ts-pattern";
import { DEFAULT_PROJECT_NAME } from "@/constants";

export function getProjectName(): ResultAsync<string, Error> {
    const cliArg = argv[2]?.trim();

    return (cliArg != null && cliArg !== "")
        ? okAsync(cliArg)
        : fromPromise(
                text({
                    message: "Project name",
                    placeholder: DEFAULT_PROJECT_NAME,
                    defaultValue: DEFAULT_PROJECT_NAME,
                    validate: validateProjectName,
                }),
                (e) => (e instanceof Error ? e : new Error(String(e))),
            ).andThen((answer) =>
                match(answer)
                    .with(P.when(isCancel), () => err(new Error("Operation cancelled")))
                    .with(P.string, (name) => ok(name))
                    .exhaustive(),
            );
}

export function validateProjectName(value: string | undefined): string | undefined {
    const name = value ?? "";
    const rules: Array<[(n: string) => boolean, string]> = [
        [(n) => /^[a-z0-9][a-z0-9-_]*$/.test(n), "Only lowercase letters, numbers, hyphens, and underscores"],
        [(n) => !n.startsWith("."), "Name cannot start with a dot"],
    ];

    return rules.find(([predicate]) => name !== "" && !predicate(name))?.[1];
}
