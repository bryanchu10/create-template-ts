import { execSync } from "node:child_process";
import { fromThrowable } from "neverthrow";

export function safeExecSync(cmd: string, opts: { cwd: string; stdio: "inherit" }) {
    return fromThrowable(
        (c: string, o: { cwd: string; stdio: "inherit" }) => execSync(c, o),
        e => (e instanceof Error ? e : new Error(String(e))),
    )(cmd, opts);
}
