import { getBranchNames } from "../branches";
import { TestGitHubActionContext } from "@octopusdeploy/shared-action-utils";

test("run with default main branch outputs correctly", () => {
    const context = new TestGitHubActionContext();
    context.addInput("github_ref", "refs/heads/main");
    context.addInput("github_base_ref", "");
    context.addInput("github_head_ref", "");
    context.addInput("github_event_base_ref", "");
    context.addInput("github_event_name", "workflow_dispatch");
    context.addInput("github_event_repository_default_branch", "main");
    context.addInput("tag_prefix_to_remove", "");
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
    context.addInput("github_ref", "refs/heads/dev");
    context.addInput("github_base_ref", "");
    context.addInput("github_head_ref", "");
    context.addInput("github_event_base_ref", "");
    context.addInput("github_event_name", "workflow_dispatch");
    context.addInput("github_event_repository_default_branch", "main");
    context.addInput("tag_prefix_to_remove", "");
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
    context.addInput("github_ref", "refs/tags/v1");
    context.addInput("github_base_ref", "");
    context.addInput("github_head_ref", "");
    context.addInput("github_event_base_ref", "");
    context.addInput("github_event_name", "workflow_dispatch");
    context.addInput("github_event_repository_default_branch", "main");
    context.addInput("tag_prefix_to_remove", "");
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
    context.addInput("github_ref", "refs/tags/v1");
    context.addInput("github_base_ref", "");
    context.addInput("github_head_ref", "");
    context.addInput("github_event_base_ref", "");
    context.addInput("github_event_name", "workflow_dispatch");
    context.addInput("github_event_repository_default_branch", "main");
    context.addInput("tag_prefix_to_remove", "v");
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
    context.addInput("github_ref", "refs/tags/a1");
    context.addInput("github_base_ref", "");
    context.addInput("github_head_ref", "");
    context.addInput("github_event_base_ref", "");
    context.addInput("github_event_name", "workflow_dispatch");
    context.addInput("github_event_repository_default_branch", "main");
    context.addInput("tag_prefix_to_remove", "v");
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
    context.addInput("github_ref", "refs/pull/2/merge");
    context.addInput("github_base_ref", "main");
    context.addInput("github_head_ref", "test;env;#");
    context.addInput("github_event_base_ref", "");
    context.addInput("github_event_name", "pull_request");
    context.addInput("github_event_repository_default_branch", "main");
    context.addInput("tag_prefix_to_remove", "v");
    getBranchNames(context);

    const outputs = context.getOutputs();
    expect(outputs).toEqual({
        base_ref_branch: "main",
        current_branch: "testenv",
        default_branch: "main",
        head_ref_branch: "testenv",
        is_default: false,
        is_tag: false,
        ref_branch: "2/merge",
        tag: "",
    });
});

test("run with bad characters escapes outputs correctly", () => {
    const context = new TestGitHubActionContext();
    context.addInput("github_ref", "refs/heads/test;env;#");
    context.addInput("github_base_ref", "");
    context.addInput("github_head_ref", "");
    context.addInput("github_event_base_ref", "");
    context.addInput("github_event_name", "workflow_dispatch");
    context.addInput("github_event_repository_default_branch", "main");
    context.addInput("tag_prefix_to_remove", "");
    getBranchNames(context);

    const outputs = context.getOutputs();
    expect(outputs).toEqual({
        base_ref_branch: "",
        current_branch: "testenv",
        default_branch: "main",
        head_ref_branch: "",
        is_default: false,
        is_tag: false,
        ref_branch: "testenv",
        tag: "",
    });
});
