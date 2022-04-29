import { GitHubActionsContextImpl } from "@octopusdeploy/shared-action-utils";
import { addChangesetAction } from "./addChangesetAction";

addChangesetAction(new GitHubActionsContextImpl()).catch(() => process.exit(1));
