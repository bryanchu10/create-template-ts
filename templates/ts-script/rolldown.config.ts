export default {
    input: ["src/index.ts"],
    platform: "node",
    resolve: {
        alias: {
            "@": "./src",
        },
    },
};
