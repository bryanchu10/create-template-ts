import { describe, expect, it } from "vitest";
import { greet } from "./index";

describe("greet", () => {
    it("defaults to English", () => {
        expect(greet()).toBe("Hello, World!");
    });

    it("greets in English", () => {
        expect(greet("en")).toBe("Hello, World!");
    });

    it("greets in Chinese", () => {
        expect(greet("zh")).toBe("你好，世界！");
    });

    it("greets in Japanese", () => {
        expect(greet("ja")).toBe("こんにちは、世界！");
    });
});
