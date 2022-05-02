import { existsSync } from "fs";
import { readFile } from "fs/promises";
import glob, { IOptions } from "glob";
import { getExecOutput } from "@actions/exec";
import { exec } from "@actions/exec";
import path from "path";

const globAsync = (pattern: string, options: IOptions): Promise<string[]> => {
    return new Promise<string[]>((resolve, reject) => {
        glob(pattern, options, (error, matches) => {
            if (error) {
                reject(error);
            } else {
                resolve(matches);
            }
        });
    });
};

type PackageJson = {
    name: string;
    version: string;
};

const loadProjectPackageJson = async (packageJsonPath: string): Promise<PackageJson> => {
    if (!existsSync(packageJsonPath)) {
        throw new Error(`Could not locate package.json in ${packageJsonPath}`);
    }

    const contents = await readFile(packageJsonPath);

    return JSON.parse(contents.toString());
};

type ActionToPublish = {
    name: string;
    version: string;
    tag: string;
    releaseBranch: string;
    directoryPath: string;
};

// Each action has two folders, the source folder under packages and a folder that is
// used to hold the action used in workflows including the transpiled js, which lives at the top level.
// e.g. action "add-changeset" has folders {repoRoot}/add-changeset and {repoRoot}/packages/add-changeset.
//
// In development and main branches we don't store the transpiled js as we don't want it to sully up the repo.
// Instead during publishing a new version of the action we will copy the js from the dist folder of the package
// over to the action folder and then commit it to a "distribution branch". Distribution branches are based on the
// major version of the version of the action e.g. add-change@1.2.0 -> v1.
//
// Specifically, publishing involves the following individually for each action:
// * Get the package version from package.json
// * Check if there is an existing tag for that version (taking into consideration the changesets tagging structure for multi-package repos - packagename@version e.g. add-changeset@0.1.0).
//   If the tag already exists we don't need to do anything as this version has already been published.
// * Commit the changes for the action to a detached branch. The assumption here is that the contents of the transpiled
//   js have already been copied across to the action folder prior to the publish
// * Create tag for version
// * Push branches with follow tags

async function publish(): Promise<void> {
    const actions = await globAsync("**/action.yml", { ignore: ["packages/**", "node_modules/**", "**/__tests/**"] });

    const actionsToPublish: Array<ActionToPublish> = [];

    for (const actionPath of actions) {
        // Get the folder of the action which doubles as the key
        // e.g. for {reporoot}/extract-package-details/action.yml
        // the action key is extrac-package-details
        let actionPathFolders = actionPath.split("/");
        actionPathFolders = actionPathFolders.slice(0, actionPathFolders.length - 1);
        const actionFolder = actionPathFolders[actionPathFolders.length - 1];
        const packageJsonPathForAction = `./packages/${actionFolder}/package.json`;

        const packageJsonForAction = await loadProjectPackageJson(packageJsonPathForAction);

        actionsToPublish.push({
            name: packageJsonForAction.name,
            version: packageJsonForAction.version,
            tag: `${packageJsonForAction.name}@${packageJsonForAction.version}`,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            releaseBranch: `v${packageJsonForAction.version.split(".")[0]!}`,
            directoryPath: path.join(...actionPathFolders),
        });
    }

    console.log(actionsToPublish);

    for (const actionToPublish of actionsToPublish) {
        const { exitCode, stderr } = await getExecOutput(`git`, ["ls-remote", "--exit-code", "origin", "--tags", `refs/tags/${actionToPublish.tag}`], {
            ignoreReturnCode: true,
        });
        if (exitCode === 0) {
            console.log(`Action is not being published because version ${actionToPublish.tag} is already published`);
            continue;
        }
        if (exitCode !== 2) {
            throw new Error(`git ls-remote exited with ${exitCode}:\n${stderr}`);
        }

        console.log(
            `Publishing action '${actionToPublish.name}' version '${actionToPublish.version}' to distribution branch '${actionToPublish.releaseBranch}'`
        );

        await exec("git", ["checkout", "--detach"]);
        await exec("git", ["add", "--force", actionToPublish.directoryPath]);
        await exec("git", ["commit", "-m", actionToPublish.tag]);

        // The -m option here creates an annotated tag,
        // we need this so that the push with --follow-tags grabs the tag too
        await exec("git", ["tag", actionToPublish.tag, "-m", actionToPublish.tag]);

        await exec("git", ["push", "--force", "--follow-tags", "origin", `HEAD:refs/heads/${actionToPublish.releaseBranch}`]);
    }
}

publish().catch(() => process.exit(1));
