import { getBranchNames } from "../branches";
import { TestGitHubActionContext } from "@octopusdeploy/shared-action-utils";

test("run with default main branch outputs correctly", () => {
    const context = new TestGitHubActionContext();
    context.addInput("gitHubRef", "refs/heads/main");
    context.addInput("gitHubBaseRef", "");
    context.addInput("gitHubHeadRef", "");
    context.addInput("gitHubEventBaseRef", "");
    context.addInput("gitHubEventName", "workflow_dispatch");
    context.addInput("gitHubEventRepositoryDefaultBranch", "main");
    context.addInput("tagPrefixToRemove", "");
    getBranchNames(context);

    const outputs = context.getOutputs();
    expect(outputs).toEqual({
        base_ref_branch: "",
        current_branch: "main",
        default_branch: "main",
        head_ref_branch: "",
        is_default: true,
        is_tag: false,
        ref_branch: "main",
        tag: "",
    });
});

test("run with non default dev branch outputs correctly", () => {
    const context = new TestGitHubActionContext();
    context.addInput("gitHubRef", "refs/heads/dev");
    context.addInput("gitHubBaseRef", "");
    context.addInput("gitHubHeadRef", "");
    context.addInput("gitHubEventBaseRef", "");
    context.addInput("gitHubEventName", "workflow_dispatch");
    context.addInput("gitHubEventRepositoryDefaultBranch", "main");
    context.addInput("tagPrefixToRemove", "");
    getBranchNames(context);

    const outputs = context.getOutputs();
    expect(outputs).toEqual({
        base_ref_branch: "",
        current_branch: "dev",
        default_branch: "main",
        head_ref_branch: "",
        is_default: false,
        is_tag: false,
        ref_branch: "dev",
        tag: "",
    });
});

test("run with tag inputs and no prefix to remove outputs correctly", () => {
    const context = new TestGitHubActionContext();
    context.addInput("gitHubRef", "refs/tags/v1");
    context.addInput("gitHubBaseRef", "");
    context.addInput("gitHubHeadRef", "");
    context.addInput("gitHubEventBaseRef", "");
    context.addInput("gitHubEventName", "workflow_dispatch");
    context.addInput("gitHubEventRepositoryDefaultBranch", "main");
    context.addInput("tagPrefixToRemove", "");
    getBranchNames(context);

    const outputs = context.getOutputs();
    expect(outputs).toEqual({
        base_ref_branch: "",
        current_branch: "",
        default_branch: "",
        head_ref_branch: "",
        is_default: false,
        is_tag: true,
        ref_branch: "",
        tag: "v1",
    });
});

test("run with tag inputs and prefix to remove that matches outputs correctly", () => {
    const context = new TestGitHubActionContext();
    context.addInput("gitHubRef", "refs/tags/v1");
    context.addInput("gitHubBaseRef", "");
    context.addInput("gitHubHeadRef", "");
    context.addInput("gitHubEventBaseRef", "");
    context.addInput("gitHubEventName", "workflow_dispatch");
    context.addInput("gitHubEventRepositoryDefaultBranch", "main");
    context.addInput("tagPrefixToRemove", "v");
    getBranchNames(context);

    const outputs = context.getOutputs();
    expect(outputs).toEqual({
        base_ref_branch: "",
        current_branch: "",
        default_branch: "",
        head_ref_branch: "",
        is_default: false,
        is_tag: true,
        ref_branch: "",
        tag: "1",
    });
});

test("run with tag inputs and prefix to remove that does not match outputs correctly", () => {
    const context = new TestGitHubActionContext();
    context.addInput("gitHubRef", "refs/tags/a1");
    context.addInput("gitHubBaseRef", "");
    context.addInput("gitHubHeadRef", "");
    context.addInput("gitHubEventBaseRef", "");
    context.addInput("gitHubEventName", "workflow_dispatch");
    context.addInput("gitHubEventRepositoryDefaultBranch", "main");
    context.addInput("tagPrefixToRemove", "v");
    getBranchNames(context);

    const outputs = context.getOutputs();
    expect(outputs).toEqual({
        base_ref_branch: "",
        current_branch: "",
        default_branch: "",
        head_ref_branch: "",
        is_default: false,
        is_tag: true,
        ref_branch: "",
        tag: "a1",
    });
});

test("run with pull request inputs outputs correctly", () => {
    const context = new TestGitHubActionContext();
    context.addInput("gitHubRef", "refs/pull/2/merge");
    context.addInput("gitHubBaseRef", "main");
    context.addInput("gitHubHeadRef", "test;env;#");
    context.addInput("gitHubEventBaseRef", "");
    context.addInput("gitHubEventName", "pull_request");
    context.addInput("gitHubEventRepositoryDefaultBranch", "main");
    context.addInput("tagPrefixToRemove", "v");
    getBranchNames(context);

    const outputs = context.getOutputs();
    expect(outputs).toEqual({
        base_ref_branch: "main",
        current_branch: "test-env-#",
        default_branch: "main",
        head_ref_branch: "test-env-#",
        is_default: false,
        is_tag: false,
        ref_branch: "2/merge",
        tag: "",
    });
});
