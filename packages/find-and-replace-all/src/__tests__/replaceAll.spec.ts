import { GitHubActionsContext } from "GitHubActionsContext";
import { replaceAll } from "../replaceAll";

class TestGitHubActionContext implements GitHubActionsContext {
    inputs: Record<string, string> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    outputs: Record<string, any> = {};
    failureMessage: string | undefined;

    addInput(name: string, value: string) {
        this.inputs[name] = value;
    }

    getOutputs() {
        return this.outputs;
    }

    getFailureMessage() {
        return this.failureMessage;
    }

    getInput(name: string): string {
        return this.inputs[name] || "";
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOutput(name: string, value: any): void {
        this.outputs[name] = value;
    }

    setFailed(message: string): void {
        this.failureMessage = message;
    }
}

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

    expect(context.failureMessage).toBe("One of 'searchString' or 'searchRegex' must be provided");
});
