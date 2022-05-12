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
        pnpm: "< 7.0.0",
    },
    postUpgradeTasks: {
        commands: ["pnpm build"],
        fileFilters: ["**/index.js"],
        executionMode: "update"
    }
};
