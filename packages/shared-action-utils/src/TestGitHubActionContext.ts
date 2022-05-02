import { EOL } from "os";
import { GitHubActionsContext, InputOptions } from "./GitHubActionsContext";

export class TestGitHubActionContext implements GitHubActionsContext {
    inputs: Record<string, string> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    outputs: Record<string, any> = {};
    failureMessage: string | undefined;

    addInput(name: string, value: string) {
        this.inputs[name] = value;
    }

    addMultilineInput(name: string, values: string[]) {
        let inputValue = "";

        for (const value of values) {
            if (inputValue !== "") {
                inputValue += EOL;
            }

            inputValue += value;
        }

        this.inputs[name] = inputValue;
    }

    getOutputs() {
        return this.outputs;
    }

    getFailureMessage() {
        return this.failureMessage;
    }

    getInput(name: string, options?: InputOptions): string {
        const inputValue = this.inputs[name];
        if (inputValue === undefined && options?.required === true) throw new Error(`Input required and not supplied: ${name}`);
        return inputValue || "";
    }

    getMultilineInput(name: string, options?: InputOptions): string[] {
        const input = this.getInput(name, options);
        if (input === "") return [];

        return input.split(EOL);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOutput(name: string, value: any): void {
        this.outputs[name] = value;
    }

    setFailed(message: string): void {
        this.failureMessage = message;
    }

    info(message: string): void {
        console.log(message);
    }
}
