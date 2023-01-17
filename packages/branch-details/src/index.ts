import { GitHubActionsContextImpl } from "@octopusdeploy/shared-action-utils";
import { getBranchDetails } from "branches";

getBranchDetails(new GitHubActionsContextImpl());
