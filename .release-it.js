export default {
    git: {
        // eslint-disable-next-line no-template-curly-in-string
        commitMessage: "chore: release ${version}",
        // eslint-disable-next-line no-template-curly-in-string
        tagName: "v${version}",
    },
    github: {
        release: false,
    },
    npm: {
        publish: false,
    },
    plugins: {
        "@release-it/conventional-changelog": {
            preset: "conventionalcommits",
            infile: "CHANGELOG.md",
            writerOpts: {
                formatDate: date =>
                    new Date(date).toLocaleDateString("sv-SE", {
                        timeZone: new Intl.DateTimeFormat().resolvedOptions().timeZone,
                    }),
            },
        },
    },
};
