import { Changeset, Release, VersionType } from "@changesets/types";
import { getInput, setOutput, setFailed, getMultilineInput } from "@actions/core";
import glob, { IOptions } from "glob";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import write from "@changesets/write";

type AddChangesetParameters = {
    filter?: RegExp;
    ignore?: Array<string>;
    type?: VersionType;
    summary: string;
    cwd?: string;
};

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
};

const loadProjectPackageJson = async (packageJsonPath: string): Promise<PackageJson> => {
    if (!existsSync(packageJsonPath)) {
        throw new Error(`Could not locate package.json in ${packageJsonPath}`);
    }

    const contents = await readFile(packageJsonPath);

    return JSON.parse(contents.toString());
};

async function addChangeset({ filter, ignore, type, summary, cwd }: AddChangesetParameters): Promise<string> {
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

    console.log(`Writing changeset '${JSON.stringify(changeset)}'`);

    const writtenChangeset = await write(changeset, cwd || ".");

    console.log(`Changeset '${writtenChangeset}' created`);

    return writtenChangeset;
}

try {
    const filter = getInput("filter");
    const ignore = getMultilineInput("ignore");
    const type = getInput("type");

    if (type !== "major" && type !== "minor" && type !== "patch") throw new Error("Type must be one of 'major', 'minor' or 'patch'");

    const summary = getInput("summary");
    const cwd = getInput("cwd");

    const changesetFilePath = addChangeset({
        filter: filter === "" ? undefined : new RegExp(filter),
        summary,
        ignore,
        type,
        cwd,
    });

    setOutput("changeset", changesetFilePath);
} catch (error) {
    setFailed(error.message);
}
