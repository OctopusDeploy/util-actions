import { exec, getExecOutput } from "@actions/exec";
import { getActions, GitHubAction } from "./getActions";

async function publishActionIfRequired(action: GitHubAction): Promise<void> {
    // GitHub workflows don't support tags in the standard changelog format '{name}@{version}',
    // so we'll create some in the format
    const tag = `${action.name}.${action.version}`;

    const { exitCode, stderr } = await getExecOutput(`git`, ["ls-remote", "--exit-code", "origin", "--tags", `refs/tags/${tag}`], {
        ignoreReturnCode: true,
    });
    if (exitCode === 0) {
        console.log(`Action ${action.name} with version ${action.version} is already published`);
        return;
    }
    if (exitCode !== 2) {
        throw new Error(`git ls-remote exited with ${exitCode}:\n${stderr}`);
    }

    console.log(`Publishing action '${action.name}' version '${action.version}'`);

    await exec("git", ["tag", tag, "-m", tag]);

    // This is so the changesets action picks up the tag and creates
    // us a GitHub release
    console.log(`New tag: ${tag}`);
}

async function publish(): Promise<void> {
    const actions = await getActions();

    for (const action of actions) {
        await publishActionIfRequired(action);
    }
}

publish().catch(() => process.exit(1));
