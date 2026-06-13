import { okAsync } from "neverthrow";
import { getLatestVer } from "./get-latest-ver";

export function makeResolver(pinnedVersions: Record<string, string> | undefined) {
    return (dep: string) => {
        const pinned = pinnedVersions?.[dep];

        return pinned ? okAsync([dep, pinned] as const) : getLatestVer(dep).map(ver => [dep, ver] as const);
    };
}
