import { GitHubActionsContext } from "@octopusdeploy/shared-action-utils";

export function currentBranchName(context: GitHubActionsContext) {
    try {
        let refToUse: string = "";

        const githubRef = context.getInput("github_ref");
        const githubHeadRef = context.getInput("github_head_ref");
        const githubEventName = context.getInput("github_event_name");
        const replacementStrings = context.getInput("replacement_strings").split(",");
        const replacementValue = context.getInput("replacement_value");

        if (githubEventName === "pull_request") {
            refToUse = githubHeadRef;
        } else {
            refToUse = githubRef;
        }

        for (const characterToReplace of [";", "#"]) {
            refToUse = refToUse.replaceAll(characterToReplace, "");
        }

        refToUse = refToUse.replace(/refs\/heads\//, "").replace(/refs\/tags\//, "");

        for (const characterToReplace of replacementStrings) {
            refToUse = refToUse.replaceAll(characterToReplace, replacementValue);
        }

        context.setOutput("branch_name", refToUse);
    } catch (error) {
        context.setFailed(error.message);
    }
}
