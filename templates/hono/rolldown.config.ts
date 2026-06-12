export default {
    input: ["src/index.ts"],
    platform: "node",
    external: ["better-sqlite3", "pino", "pino-pretty", "pino-http"],
    resolve: {
        alias: {
            "@": "./src",
        },
    },
};
