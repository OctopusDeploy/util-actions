import { Changeset, Release, VersionType } from "@changesets/types";
import { info } from "@actions/core";
import write from "@changesets/write";
import path from "path";
import glob, { IOptions } from "glob";
import { existsSync } from "fs";
import { readFile } from "fs/promises";

export type AddChangesetParameters = {
    filter?: RegExp;
    ignore?: Array<string>;
    type?: VersionType;
    summary: string;
    cwd?: string;
};

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
};

export const loadProjectPackageJson = async (packageJsonPath: string): Promise<PackageJson> => {
    if (!existsSync(packageJsonPath)) {
        throw new Error(`Could not locate package.json in ${packageJsonPath}`);
    }

    const contents = await readFile(packageJsonPath);

    return JSON.parse(contents.toString());
};

export type CreatedChangeset = {
    name: string;
    path: string;
};

export async function addChangeset({ filter, ignore, type, summary, cwd }: AddChangesetParameters): Promise<CreatedChangeset> {
    const packageJsonFilePaths = await globAsync("**/package.json", { absolute: true, ignore: ignore });

    const releases: Release[] = [];

    for (const packageJsonPath of packageJsonFilePaths) {
        const packageJson = await loadProjectPackageJson(packageJsonPath);

        let addPackage = true;

        if (filter !== undefined && !filter.test(packageJson.name)) {
            addPackage = false;
        }

        if (addPackage) {
            releases.push({
                name: packageJson.name,
                type: type || "patch",
            });
        }
    }

    const changeset: Changeset = {
        summary,
        releases,
    };

    info(`Writing changeset '${JSON.stringify(changeset)}'`);

    const workingDirectory = cwd || ".";
    const changesetDirectory = path.join(workingDirectory, ".changeset");

    const changesetName = await write(changeset, cwd || ".");

    const changesetPath = path.join(changesetDirectory, `${changesetName}.md`);

    info(`Changeset '${changesetName}' created at '${changesetPath}'`);

    return { name: changesetName, path: changesetPath };
}
