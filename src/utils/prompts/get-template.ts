import type { ResultAsync } from "neverthrow";
import type { TemplateValue } from "@/constants";
import { isCancel, select } from "@clack/prompts";
import { err, fromPromise, ok } from "neverthrow";
import { match, P } from "ts-pattern";
import { TEMPLATES } from "@/constants";

export function getTemplate(): ResultAsync<TemplateValue, Error> {
    const options = (Object.keys(TEMPLATES) as TemplateValue[]).map((key) => ({
        value: key,
        label: key,
        hint: TEMPLATES[key].hint,
    }));

    return fromPromise(
        select({
            message: "Select a template",
            options,
        }),
        (e) => (e instanceof Error ? e : new Error(String(e))),
    ).andThen((answer) =>
        match(answer)
            .with(P.when(isCancel), () => err(new Error("Operation cancelled")))
            .with(P.string, (t) => ok(t))
            .exhaustive(),
    );
}
