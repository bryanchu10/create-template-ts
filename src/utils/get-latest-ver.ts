import type { ResultAsync } from "neverthrow";
import { fromPromise } from "neverthrow";

function getLatestVer(pkg: string): ResultAsync<string, Error> {
    const encoded = pkg.startsWith("@") ? pkg.replace("/", "%2F") : pkg;

    return fromPromise(
        fetch(`https://registry.npmjs.org/${encoded}/latest`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch version for ${pkg}`);
                }

                return res.json() as Promise<{ version: string }>;
            })
            .then(({ version }) => `^${version}`),
        e => e as Error,
    );
}

export {
    getLatestVer,
};
