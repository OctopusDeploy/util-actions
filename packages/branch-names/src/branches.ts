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

        const githubRef = context.getInput("gitHubRef");
        const githubBaseRef = context.getInput("gitHubBaseRef");
        const githubHeadRef = context.getInput("gitHubHeadRef");
        const githubEventBaseRef = context.getInput("gitHubEventBaseRef");
        const githubEventName = context.getInput("gitHubEventName");
        const githubEventRepositoryDefaultBranch = context.getInput("gitHubEventRepositoryDefaultBranch");
        const tagPrefixToRemove = context.getInput("tagPrefixToRemove");

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

        currentBranch = currentBranch.replaceAll(";", "-");
        baseRefBranch = baseRefBranch.replaceAll(";", "-");
        headRefBranch = headRefBranch.replaceAll(";", "-");
        refBranch = refBranch.replaceAll(";", "-");

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
