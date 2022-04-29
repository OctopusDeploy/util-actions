import { getInput, setOutput, setFailed } from "@actions/core";
import { GitHubActionsContext } from "./GitHubActionsContext";

export class GitHubActionsContextImpl implements GitHubActionsContext {
    getInput(name: string): string {
        return getInput(name);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOutput(name: string, value: any): void {
        return setOutput(name, value);
    }

    setFailed(message: string): void {
        return setFailed(message);
    }
}
