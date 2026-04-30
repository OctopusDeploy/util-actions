module.exports = {
    extends: [
        "config:base",
        ":disableMajorUpdates",
        ":ignoreModulesAndTests",
        ":pinVersions",
        ":rebaseStalePrs",
        // Automatic merging is temporarily disabled.
        // ":automergeDigest",
        // ":automergePatch",
        ":automergePr",
        ":automergeRequireAllStatusChecks",
        // ":automergeLinters",
        // ":automergeTesters",
        // ":automergeTypes",
        "packages:eslint",
        "workarounds:typesNodeVersioning",
        "github>whitesource/merge-confidence:beta",
    ],
    branchPrefix: "renovate/",
    platform: "github",
    repositories: ["OctopusDeploy/util-actions"],
    packageRules: [
        {
            matchDatasources: ['npm'],
            minimumReleaseAge: '2 days'
        },
        {
            // Ignore workspace packages that aren't published to npm
            matchPackageNames: ['@octopusdeploy/shared-action-utils'],
            enabled: false
        }
    ],
    timezone: "Australia/Brisbane",
    onboarding: false,
    requireConfig: false,
    binarySource: "install",
    constraints: {
        pnpm: "8.15.9",
    },
    allowedPostUpgradeCommands: [".*"],
    postUpgradeTasks: {
        commands: ["pnpm install", "pnpm build", "rm -rf node_modules packages/*/node_modules"],
        fileFilters: ["**/index.js"],
        executionMode: "update",
    },
};
