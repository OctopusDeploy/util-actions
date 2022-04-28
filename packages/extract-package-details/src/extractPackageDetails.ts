import path from "path";
import { GitHubActionsContext } from "@octopusdeploy/shared-action-utils";

export function extractPackageDetails(context: GitHubActionsContext) {
    try {
        let dirPath = context.getInput("path");
        if (dirPath === "") {
            throw new Error("Path must be provided");
        }
        dirPath = path.resolve(dirPath);

        const packageJsonPath = path.join(dirPath, "package.json");
        const packageJson = require(packageJsonPath);

        const name = packageJson.name.toString();
        const version = packageJson.version.toString();

        context.setOutput("name", name);
        context.setOutput("version", version);
    } catch (error) {
        context.setFailed(error.message);
    }
}
