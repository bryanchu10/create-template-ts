import { describe, expect, it } from "vitest";
import { sortKeys } from "./sort-keys";

describe("sortKeys", () => {
    it("returns undefined when input is undefined", () => {
        expect(sortKeys(undefined)).toBeUndefined();
    });

    it("sorts keys alphabetically", () => {
        const result = sortKeys({ zod: "^3.0.0", hono: "^4.0.0", neverthrow: "^4.0.0" });
        expect(Object.keys(result!)).toEqual(["hono", "neverthrow", "zod"]);
    });

    it("sorts scoped packages before unscoped ones", () => {
        const result = sortKeys({ hono: "^4.0.0", "@hono/node-server": "^1.0.0" });
        expect(Object.keys(result!)).toEqual(["@hono/node-server", "hono"]);
    });

    it("preserves values", () => {
        const result = sortKeys({ b: "^2.0.0", a: "^1.0.0" });
        expect(result).toEqual({ a: "^1.0.0", b: "^2.0.0" });
    });
});
