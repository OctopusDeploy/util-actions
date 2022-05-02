import { getInput, getMultilineInput, setOutput, setFailed, info } from "@actions/core";
import { GitHubActionsContext, InputOptions } from "./GitHubActionsContext";

export class GitHubActionsContextImpl implements GitHubActionsContext {
    getInput(name: string, options?: InputOptions): string {
        return getInput(name, options);
    }

    getMultilineInput(name: string, options?: InputOptions): string[] {
        return getMultilineInput(name, options);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOutput(name: string, value: any): void {
        return setOutput(name, value);
    }

    setFailed(message: string): void {
        return setFailed(message);
    }

    info(message: string): void {
        return info(message);
    }
}
