import { ok } from "neverthrow";
import { match } from "ts-pattern";

type Language = "en" | "zh" | "ja";

function buildGreeting(language: Language) {
    return match(language)
        .with("en", () => ok("Hello, World!"))
        .with("zh", () => ok("你好，世界！"))
        .with("ja", () => ok("こんにちは、世界！"))
        .exhaustive();
}

export function greet(language: Language = "en"): string {
    return buildGreeting(language).match(
        msg => msg,
        () => "Hello, World!",
    );
}
