import { existsSync } from "fs";
import { readFile } from "fs/promises";
import glob, { IOptions } from "glob";
import path from "path";

export const globAsync = (pattern: string, options: IOptions): Promise<string[]> => {
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

export const loadProjectPackageJson = async (packageJsonPath: string): Promise<PackageJson> => {
    if (!existsSync(packageJsonPath)) {
        throw new Error(`Could not locate package.json in ${packageJsonPath}`);
    }

    const contents = await readFile(packageJsonPath);

    return JSON.parse(contents.toString());
};

export type GitHubAction = {
    name: string;
    version: string;
    directoryPath: string;
};

export async function getActions(): Promise<Array<GitHubAction>> {
    const actions = await globAsync("**/action.yml", { ignore: ["packages/**", "node_modules/**", "**/__tests/**"] });

    const actionsToPublish: Array<GitHubAction> = [];

    for (const actionPath of actions) {
        // Get the folder of the action which doubles as the key
        // e.g. for {reporoot}/extract-package-details/action.yml
        // the action key is extract-package-details
        let actionPathFolders = actionPath.split("/");
        actionPathFolders = actionPathFolders.slice(0, actionPathFolders.length - 1);
        const actionFolder = actionPathFolders[actionPathFolders.length - 1];
        const packageJsonPathForAction = `./packages/${actionFolder}/package.json`;

        const packageJsonForAction = await loadProjectPackageJson(packageJsonPathForAction);

        actionsToPublish.push({
            name: packageJsonForAction.name,
            version: packageJsonForAction.version,
            directoryPath: path.join(...actionPathFolders),
        });
    }

    return actionsToPublish;
}
