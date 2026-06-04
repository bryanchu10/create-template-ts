import type { ResultAsync } from "neverthrow";
import type { TemplateValue } from "@/constants";
import { isCancel, select } from "@clack/prompts";
import { err, fromPromise, ok } from "neverthrow";
import { match, P } from "ts-pattern";
import { TEMPLATES } from "@/constants";

export function getTemplate(): ResultAsync<TemplateValue, Error> {
    return fromPromise(
        select({
            message: "Select a template",
            options: [...TEMPLATES],
        }),
        e => e as Error,
    ).andThen(answer =>
        match(answer)
            .with(P.when(isCancel), () => err(new Error("Operation cancelled")))
            .with(P.string, t => ok(t as TemplateValue))
            .exhaustive(),
    );
}
