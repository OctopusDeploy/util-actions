import { currentBranchName } from "../currentBranchName";
import { TestGitHubActionContext } from "@octopusdeploy/shared-action-utils";

test("run with default main branch outputs correctly", () => {
    const context = new TestGitHubActionContext();
    context.addInput("github_ref", "refs/heads/main");
    context.addInput("github_head_ref", "");
    context.addInput("github_event_name", "workflow_dispatch");
    context.addInput("additional_strings_to_replace", "/");
    context.addInput("replacement_value", "-");
    currentBranchName(context);

    const outputs = context.getOutputs();
    expect(outputs).toEqual({
        branch_name: "main",
    });
});

test("run with non default dev branch outputs correctly", () => {
    const context = new TestGitHubActionContext();
    context.addInput("github_ref", "refs/heads/dev");
    context.addInput("github_head_ref", "");
    context.addInput("github_event_name", "workflow_dispatch");
    context.addInput("additional_strings_to_replace", "/");
    context.addInput("replacement_value", "-");
    currentBranchName(context);

    const outputs = context.getOutputs();
    expect(outputs).toEqual({
        branch_name: "dev",
    });
});

test("run with tag inputs outputs correctly", () => {
    const context = new TestGitHubActionContext();
    context.addInput("github_ref", "refs/tags/v1");
    context.addInput("github_head_ref", "");
    context.addInput("github_event_name", "workflow_dispatch");
    context.addInput("additional_strings_to_replace", "/");
    context.addInput("replacement_value", "-");
    currentBranchName(context);

    const outputs = context.getOutputs();
    expect(outputs).toEqual({
        branch_name: "v1",
    });
});

test("run with pull request inputs outputs correctly", () => {
    const context = new TestGitHubActionContext();
    context.addInput("github_ref", "refs/pull/2/merge");
    context.addInput("github_head_ref", "test;env;#");
    context.addInput("github_event_name", "pull_request");
    context.addInput("additional_strings_to_replace", "/");
    context.addInput("replacement_value", "-");
    currentBranchName(context);

    const outputs = context.getOutputs();
    expect(outputs).toEqual({
        branch_name: "testenv",
    });
});

test("run with bad characters escapes outputs correctly", () => {
    const context = new TestGitHubActionContext();
    context.addInput("github_ref", "refs/heads/test;env;#");
    context.addInput("github_head_ref", "");
    context.addInput("github_event_name", "workflow_dispatch");
    context.addInput("additional_strings_to_replace", "/");
    context.addInput("replacement_value", "-");
    currentBranchName(context);

    const outputs = context.getOutputs();
    expect(outputs).toEqual({
        branch_name: "testenv",
    });
});

test("run with branch in git folder", () => {
    const context = new TestGitHubActionContext();
    context.addInput("github_ref", "refs/heads/test-folder/my-branch");
    context.addInput("github_head_ref", "");
    context.addInput("github_event_name", "workflow_dispatch");
    context.addInput("additional_strings_to_replace", "/");
    context.addInput("replacement_value", "-");
    currentBranchName(context);

    const outputs = context.getOutputs();
    expect(outputs).toEqual({
        branch_name: "test-folder-my-branch",
    });
});

test("multiple replacement characters returns correct branch_name", () => {
    const context = new TestGitHubActionContext();
    context.addInput("github_ref", "refs/heads/test-folder/test-folder\\my-branch");
    context.addInput("github_head_ref", "");
    context.addInput("github_event_name", "workflow_dispatch");
    context.addMultilineInput("additional_strings_to_replace", ["\\", "/"]);
    context.addInput("replacement_value", "-");
    currentBranchName(context);

    const outputs = context.getOutputs();
    expect(outputs).toEqual({
        branch_name: "test-folder-test-folder-my-branch",
    });
});
