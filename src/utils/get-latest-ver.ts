import type { ResultAsync } from "neverthrow";
import { err, fromPromise } from "neverthrow";

function getLatestVer(pkg: string): ResultAsync<string, Error> {
    const encoded = pkg.startsWith("@") ? pkg.replace("/", "%2F") : pkg;

    return fromPromise(fetch(`https://registry.npmjs.org/${encoded}/latest`), e => e as Error)
        .andThen(response =>
            response.ok
                ? fromPromise(response.json() as Promise<{ version: string }>, e => e as Error)
                : err(new Error(`Failed to fetch version for ${pkg}`)),
        )
        .map(({ version }) => `^${version}`);
}

export {
    getLatestVer,
};
