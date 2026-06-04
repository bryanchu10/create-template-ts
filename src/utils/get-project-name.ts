import { argv, exit } from "node:process";
import { cancel, isCancel, text } from "@clack/prompts";
import { match, P } from "ts-pattern";
import { DEFAULT_PROJECT_NAME } from "@/constants";

export async function getProjectName() {
    return argv[2]?.trim() || await askProjectName();
}

async function askProjectName() {
    const answer = await text({
        message: "Project name",
        placeholder: DEFAULT_PROJECT_NAME,
        defaultValue: DEFAULT_PROJECT_NAME,
    });

    return match(answer)
        .with(P.string, name => name)
        .with(P.when(isCancel), () => {
            cancel("Operation cancelled");
            exit(0);
        })
        .exhaustive();
}
