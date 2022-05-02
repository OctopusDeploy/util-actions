// Plan:
// * Get all packages that have actions
// * Get their package version
// * See if there is an existing tag for that version (taking into consideration the changesets tagging structure for multi-package repos - packagename@version e.g. add-changeset@0.1.0)
// * Copy and commit the relevant distributable files to their relevant action folder
// * Commit the changes to the relevant major branch for each action individually, taking into consideration each actions version
//   e.g. add-changeset@1.1.1 would be committed to v1 branch, find-and-replace-all@2.0.1 would be committed to v2 branch
// * Create tag for version
// * Push branches with follow tags

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
    majorVersionNumber: string;
    directoryPath: string;
};

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
            majorVersionNumber: `v${packageJsonForAction.version.split(".")[0]!}`,
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

        console.log(`Publishing action '${actionToPublish.name}' version '${actionToPublish.version}'`);

        await exec("git", ["checkout", "--detach"]);
        await exec("git", ["add", "--force", actionToPublish.directoryPath]);
        await exec("git", ["commit", "-m", actionToPublish.tag]);
    }
}

publish().catch(() => process.exit(1));
