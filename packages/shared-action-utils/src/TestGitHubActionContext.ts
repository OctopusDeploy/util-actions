import { GitHubActionsContext } from "./GitHubActionsContext";

export class TestGitHubActionContext implements GitHubActionsContext {
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
