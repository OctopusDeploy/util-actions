import { GitHubActionsContextImpl } from "@octopusdeploy/shared-action-utils";
import { getBranchNames } from "branches";

getBranchNames(new GitHubActionsContextImpl());
