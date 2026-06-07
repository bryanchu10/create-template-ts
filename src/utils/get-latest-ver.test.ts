import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getLatestVer } from "./get-latest-ver";

describe("getLatestVer", () => {
    beforeEach(() => {
        vi.spyOn(globalThis, "fetch");
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns version string prefixed with caret on success", async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ version: "1.2.3" }),
        } as Response);

        const result = await getLatestVer("some-pkg");
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toBe("^1.2.3");
        }
    });

    it("encodes scoped package name correctly", async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ version: "2.0.0" }),
        } as Response);

        await getLatestVer("@scope/pkg");
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining("@scope%2Fpkg"));
    });

    it("returns err when response is not ok", async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: false,
        } as Response);

        const result = await getLatestVer("bad-pkg");
        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error.message).toContain("bad-pkg");
        }
    });

    it("returns err on network failure", async () => {
        vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

        const result = await getLatestVer("some-pkg");
        expect(result.isErr()).toBe(true);
    });
});
