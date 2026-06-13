import { describe, expect, it } from "vitest";
import { validateProjectName } from "./get-project-name";

describe("validateProjectName", () => {
    it("accepts valid lowercase names", () => {
        expect(validateProjectName("my-project")).toBeUndefined();
        expect(validateProjectName("ts-start")).toBeUndefined();
        expect(validateProjectName("my_project")).toBeUndefined();
        expect(validateProjectName("test123")).toBeUndefined();
        expect(validateProjectName("a")).toBeUndefined();
    });

    it("rejects names with uppercase letters", () => {
        expect(validateProjectName("MyProject")).toBeTruthy();
        expect(validateProjectName("myProject")).toBeTruthy();
    });

    it("rejects names starting with a dot", () => {
        expect(validateProjectName(".hidden")).toBeTruthy();
    });

    it("rejects names with spaces", () => {
        expect(validateProjectName("my project")).toBeTruthy();
    });

    it("rejects empty string", () => {
        expect(validateProjectName("")).toBeTruthy();
    });

    it("rejects undefined", () => {
        expect(validateProjectName(undefined)).toBeTruthy();
    });

    it("rejects names starting with a hyphen", () => {
        expect(validateProjectName("-project")).toBeTruthy();
    });

    it("rejects names with special characters", () => {
        expect(validateProjectName("my@project")).toBeTruthy();
        expect(validateProjectName("my/project")).toBeTruthy();
    });
});
