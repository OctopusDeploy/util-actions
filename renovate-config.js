module.exports = {
    extends: [
        "config:base",
        ":disableMajorUpdates",
        ":ignoreModulesAndTests",
        ":pinVersions",
        ":rebaseStalePrs",
        ":automergeDigest",
        ":automergePatch",
        ":automergePr",
        ":automergeRequireAllStatusChecks",
        ":automergeLinters",
        ":automergeTesters",
        ":automergeTypes",
        "packages:eslint",
        "workarounds:typesNodeVersioning",
        "github>whitesource/merge-confidence:beta",
    ],
    branchPrefix: "renovate/",
    platform: "github",
    repositories: ["OctopusDeploy/util-actions"],
    packageRules: [],
    timezone: "Australia/Brisbane",
    onboarding: false,
    requireConfig: false,
    constraints: {
        pnpm: "< 8.0.0",
    },
    allowedPostUpgradeCommands: [".*"],
    postUpgradeTasks: {
        commands: ["npm i -g pnpm@7.9.5 && pnpm install && pnpm build"],
        fileFilters: ["**/index.js"],
        executionMode: "update"
    }
};
