import { currentBranchName } from "./currentBranchName";
import { GitHubActionsContextImpl } from "@octopusdeploy/shared-action-utils";

currentBranchName(new GitHubActionsContextImpl());
