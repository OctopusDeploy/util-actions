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
        }
    ],
    timezone: "Australia/Brisbane",
    onboarding: false,
    requireConfig: false,
    constraints: {
        pnpm: "8.15.9",
    },
    allowedPostUpgradeCommands: [".*"],
    postUpgradeTasks: {
        commands: ["npm i -g pnpm@8.15.9 && pnpm install && pnpm build"],
        fileFilters: ["**/index.js"],
        executionMode: "update",
    },
};
