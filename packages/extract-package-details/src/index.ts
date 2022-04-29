import { extractPackageDetails } from "extractPackageDetails";
import { GitHubActionsContextImpl } from "@octopusdeploy/shared-action-utils";

extractPackageDetails(new GitHubActionsContextImpl());
