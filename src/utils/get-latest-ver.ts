async function getLatestVer(pkg: string): Promise<string> {
    const encoded = pkg.startsWith("@") ? pkg.replace("/", "%2F") : pkg;
    const res = await fetch(`https://registry.npmjs.org/${encoded}/latest`);

    if (!res.ok) {
        throw new Error(`Failed to fetch version for ${pkg}`);
    }

    const { version } = await res.json() as { version: string };

    return `^${version}`;
}

export {
    getLatestVer,
};
