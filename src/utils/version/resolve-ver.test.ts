import { okAsync } from "neverthrow";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as getLatestVerModule from "./get-latest-ver";
import { makeResolver } from "./resolve-ver";

describe("makeResolver", () => {
    beforeEach(() => {
        vi.spyOn(getLatestVerModule, "getLatestVer");
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns pinned version without calling getLatestVer", async () => {
        const resolve = makeResolver({ "my-pkg": "^1.0.0" });
        const result = await resolve("my-pkg");

        expect(result.isOk()).toBe(true);
        if (result.isOk())
            expect(result.value).toEqual(["my-pkg", "^1.0.0"]);

        expect(getLatestVerModule.getLatestVer).not.toHaveBeenCalled();
    });

    it("calls getLatestVer when package is not pinned", async () => {
        vi.mocked(getLatestVerModule.getLatestVer).mockReturnValue(okAsync("^2.0.0"));

        const resolve = makeResolver(undefined);
        await resolve("my-pkg");

        expect(getLatestVerModule.getLatestVer).toHaveBeenCalledWith("my-pkg");
    });

    it("calls getLatestVer when package is not in pinnedVersions", async () => {
        vi.mocked(getLatestVerModule.getLatestVer).mockReturnValue(okAsync("^2.0.0"));

        const resolve = makeResolver({ "other-pkg": "^1.0.0" });
        await resolve("my-pkg");

        expect(getLatestVerModule.getLatestVer).toHaveBeenCalledWith("my-pkg");
    });
});
