import { GitHubActionsContext } from "./GitHubActionsContext";

export function replaceAll(context: GitHubActionsContext) {
    try {
        const source = context.getInput("source");
        const searchString = context.getInput("searchString");
        const searchRegex = context.getInput("searchRegex");
        let searchRegexFlags = context.getInput("searchRegexFlags");
        const replace = context.getInput("replace");

        let replaced: string = "";

        if (searchRegex !== "") {
            if (searchRegexFlags.search("g") === -1) {
                searchRegexFlags = "g" + searchRegexFlags;
            }
            replaced = source.replaceAll(new RegExp(searchRegex, searchRegexFlags), replace);
        } else if (searchString !== "") {
            replaced = source.replaceAll(searchString, replace);
        } else {
            throw new Error("One of 'searchString' or 'searchRegex' must be provided");
        }

        context.setOutput("value", replaced);
    } catch (error) {
        context.setFailed(error.message);
    }
}
