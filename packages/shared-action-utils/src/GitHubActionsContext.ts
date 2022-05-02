export type InputOptions = {
    required?: boolean;
};

export interface GitHubActionsContext {
    getInput: (name: string, options?: InputOptions) => string;
    getMultilineInput: (name: string, options?: InputOptions) => string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOutput: (name: string, value: any) => void;
    setFailed: (message: string) => void;

    info: (message: string) => void;
}
