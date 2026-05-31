export default {
    input: ["src/index.ts"],
    platform: "node",
    resolve: {
        alias: {
            "@": "./src",
        },
    },
    output: {
        banner: "#!/usr/bin/env node",
    },
};
