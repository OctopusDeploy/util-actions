export interface GitHubActionsContext {
    getInput: (name: string) => string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOutput: (name: string, value: any) => void;
    setFailed: (message: string) => void;
}
