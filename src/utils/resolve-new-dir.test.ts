import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { resolveNewDir } from "./resolve-new-dir";

describe("resolveNewDir", () => {
    it("returns ok with resolved path when directory does not exist", () => {
        const result = resolveNewDir("__nonexistent_test_dir__");
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toContain("__nonexistent_test_dir__");
        }
    });

    it("returns err when directory already exists", () => {
        const result = resolveNewDir(tmpdir());
        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error.message).toContain("Directory already exists");
        }
    });
});
