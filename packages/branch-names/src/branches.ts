import { GitHubActionsContext } from "@octopusdeploy/shared-action-utils";

export function getBranchNames(context: GitHubActionsContext) {
    try {
        let isDefault: boolean = false;
        let isTag: boolean = false;
        let defaultBranch: string = "";
        let currentBranch: string = "";
        let baseRefBranch: string = "";
        let headRefBranch: string = "";
        let refBranch: string = "";
        let tag: string = "";

        const githubRef = context.getInput("github_ref");
        const githubBaseRef = context.getInput("github_base_ref");
        const githubHeadRef = context.getInput("github_head_ref");
        const githubEventBaseRef = context.getInput("github_event_base_ref");
        const githubEventName = context.getInput("github_event_name");
        const githubEventRepositoryDefaultBranch = context.getInput("github_event_repository_default_branch");
        const tagPrefixToRemove = context.getInput("tag_prefix_to_remove");

        if (!githubRef.startsWith("refs/tags/")) {
            baseRefBranch = githubBaseRef.replace(/refs\/heads\//, "");
            headRefBranch = githubHeadRef.replace(/refs\/heads\//, "");
            refBranch = githubRef.replace(/refs\/pull\//, "").replace(/refs\/heads\//, "");

            if (githubEventName === "pull_request") {
                currentBranch = headRefBranch;
            } else {
                currentBranch = refBranch;
            }

            defaultBranch = githubEventRepositoryDefaultBranch;
            isDefault = currentBranch === githubEventRepositoryDefaultBranch;
        } else {
            const tagHeadRegex = new RegExp(`refs/heads/${tagPrefixToRemove}`, "i");
            const tagRegex = new RegExp(`refs/tags/${tagPrefixToRemove}`, "i");
            baseRefBranch = githubEventBaseRef.replace(tagHeadRegex, "");
            tag = githubRef.replace(tagRegex, "");

            baseRefBranch = baseRefBranch.replace(/refs\/heads\//, "");
            tag = tag.replace(/refs\/tags\//, "");

            isTag = true;
        }

        for (const characterToReplace of [";", "#"]) {
            currentBranch = currentBranch.replaceAll(characterToReplace, "");
            baseRefBranch = baseRefBranch.replaceAll(characterToReplace, "");
            headRefBranch = headRefBranch.replaceAll(characterToReplace, "");
            refBranch = refBranch.replaceAll(characterToReplace, "");
            tag = tag.replaceAll(characterToReplace, "");
        }

        context.setOutput("is_default", isDefault);
        context.setOutput("is_tag", isTag);
        context.setOutput("default_branch", defaultBranch);
        context.setOutput("current_branch", currentBranch);
        context.setOutput("base_ref_branch", baseRefBranch);
        context.setOutput("head_ref_branch", headRefBranch);
        context.setOutput("ref_branch", refBranch);
        context.setOutput("tag", tag);
    } catch (error) {
        context.setFailed(error.message);
    }
}
