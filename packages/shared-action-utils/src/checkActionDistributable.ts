import { getExecOutput } from "@actions/exec";
import { getActions } from "./getActions";

// Checks whether any actions have not had their distributable files updated
async function checkActionDistributable(): Promise<void> {
    const actions = await getActions();
    let hasUncommittedChanges = false;

    for (const action of actions) {
        const { exitCode, stderr, stdout } = await getExecOutput("git", ["diff", "--name-only", action.directoryPath], {
            ignoreReturnCode: true,
            silent: true,
        });

        if (exitCode !== 0) throw new Error(`git diff exited with ${exitCode}:\n${stderr}`);

        if (stdout !== "") {
            const message = `Detected uncommitted changes for action '${action.name}' after build. Please build and commit changes to the following files: ${stdout}`;
            console.error(message);
            hasUncommittedChanges = true;
        }
    }

    if (hasUncommittedChanges) {
        throw new Error("Some actions have uncommitted changes to their distributable js files, check logs above for details and commit changes");
    }
}

checkActionDistributable().catch(() => process.exit(1));
