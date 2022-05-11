import { GitHubActionsContext } from "@octopusdeploy/shared-action-utils";
import { Changeset, Release, VersionType } from "@changesets/types";
import write from "@changesets/write";
import path from "path";
import glob, { IOptions } from "glob";
import { existsSync } from "fs";
import { mkdir, readFile } from "fs/promises";

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

type CreatedChangeset = {
    name: string;
    path: string;
};

async function addChangeset({ filter, ignore, type, summary, cwd }: AddChangesetParameters, context: GitHubActionsContext): Promise<CreatedChangeset> {
    const packageJsonFilePaths = await globAsync("**/package.json", { cwd, absolute: true, ignore: ignore });

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

    context.info(`Writing changeset '${JSON.stringify(changeset)}'`);

    const workingDirectory = cwd || ".";
    const changesetDirectory = path.join(workingDirectory, ".changeset");

    if (!existsSync(changesetDirectory)) {
        await mkdir(changesetDirectory);
    }

    const changesetName = await write(changeset, cwd || ".");

    const changesetPath = path.join(changesetDirectory, `${changesetName}.md`);

    context.info(`Changeset '${changesetName}' created at '${changesetPath}'`);

    return { name: changesetName, path: changesetPath };
}

export async function addChangesetAction(context: GitHubActionsContext) {
    try {
        const filter = context.getInput("filter");
        const ignore = context.getMultilineInput("ignore");
        const type = context.getInput("type", {
            required: true,
        });

        if (type !== "major" && type !== "minor" && type !== "patch") throw new Error("Type must be one of 'major', 'minor' or 'patch'");

        const summary = context.getInput("summary");
        const cwd = context.getInput("cwd");

        const { name, path } = await addChangeset(
            {
                filter: filter === "" ? undefined : new RegExp(filter),
                summary,
                ignore,
                type,
                cwd: cwd === "" ? undefined : cwd,
            },
            context
        );

        context.setOutput("changesetName", name);
        context.setOutput("changesetPath", path);
    } catch (error) {
        context.setFailed(error.message);
    }
}
