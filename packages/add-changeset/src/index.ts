import { getInput, setOutput, setFailed, getMultilineInput } from "@actions/core";
import { addChangeset } from "./addChangeset";

// todo: convert to use context when this is available
async function addChangesetAction() {
    try {
        const filter = getInput("filter");
        const ignore = getMultilineInput("ignore");
        const type = getInput("type");

        if (type !== "major" && type !== "minor" && type !== "patch") throw new Error("Type must be one of 'major', 'minor' or 'patch'");

        const summary = getInput("summary");
        const cwd = getInput("cwd");

        const { name, path } = await addChangeset({
            filter: filter === "" ? undefined : new RegExp(filter),
            summary,
            ignore,
            type,
            cwd,
        });

        setOutput("changesetName", name);
        setOutput("changesetPath", path);
    } catch (error) {
        setFailed(error.message);
    }
}

addChangesetAction().catch(() => process.exit(1));
