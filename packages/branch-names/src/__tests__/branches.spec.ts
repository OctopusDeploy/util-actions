import { getBranchNames } from "../branches";
import { TestGitHubActionContext } from "@octopusdeploy/shared-action-utils";

test("sanitises branch correctly", () => {
    const context = new TestGitHubActionContext();
    context.addInput("gitHubRef", "ENV;#refs/heads/main");
    context.addInput("gitHubBaseRef", "ENV;#refs/heads/main");
    context.addInput("gitHubHeadRef", "ENV;#refs/heads/main");
    context.addInput("gitHubEventBaseRef", "ENV;#refs/heads/main");
    context.addInput("gitHubEventName", "ENV;#refs/heads/main");
    context.addInput("gitHubEventRepositoryDefaultBranch", "ENV;#refs/heads/main");
    context.addInput("tagPrefixToRemove", "ENV;#refs/heads/main");
    getBranchNames(context);

    const outputs = context.getOutputs();
    expect(outputs).toEqual({
        base_ref_branch: "",
        current_branch: "",
        default_branch: "",
        head_ref_branch: "",
        is_default: false,
        is_tag: false,
        ref_branch: "",
        tag: "",
    });
});
