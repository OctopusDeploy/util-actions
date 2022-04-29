import { replaceAll } from "../replaceAll";
import { TestGitHubActionContext } from "@octopusdeploy/shared-action-utils";

test("replaces all instances of a string", () => {
    const context = new TestGitHubActionContext();
    context.addInput("source", "the quick brown fox jumps over the lazy dog");
    context.addInput("searchString", "the");
    context.addInput("replace", "hooray");

    replaceAll(context);

    const outputs = context.getOutputs();
    expect(outputs).toEqual({
        value: "hooray quick brown fox jumps over hooray lazy dog",
    });
});

test("replaces all instances of a string using regex", () => {
    const context = new TestGitHubActionContext();
    context.addInput("source", "The quick brown fox jumps over the lazy dog");
    context.addInput("searchRegex", "the");
    context.addInput("searchRegexFlags", "i");
    context.addInput("replace", "hooray");

    replaceAll(context);

    const outputs = context.getOutputs();
    expect(outputs).toEqual({
        value: "hooray quick brown fox jumps over hooray lazy dog",
    });
});

test("No search input fails with error", () => {
    const context = new TestGitHubActionContext();
    context.addInput("source", "The quick brown fox jumps over the lazy dog");
    context.addInput("replace", "hooray");

    replaceAll(context);

    expect(context.getFailureMessage()).toBe("One of 'searchString' or 'searchRegex' must be provided");
});
