import { extractPackageDetails } from "extractPackageDetails";
import { TestGitHubActionContext } from "@octopusdeploy/shared-action-utils";

test("extracts name and version from package json", () => {
    const context = new TestGitHubActionContext();
    context.addInput("path", "./src/__tests__/testPackage");

    extractPackageDetails(context);
    const outputs = context.getOutputs();
    expect(outputs).toEqual({
        name: "test-package",
        version: "0.1.0",
    });
});

test("handles path that does not contain a package.json", () => {
    const context = new TestGitHubActionContext();
    context.addInput("path", "./src/__tests__");

    extractPackageDetails(context);

    expect(context.getFailureMessage()).toContain("__tests__/package.json' does not exist.");
});

test("handles path that does not exist", () => {
    const context = new TestGitHubActionContext();
    context.addInput("path", "./src/__tests__/doesnotexist");

    extractPackageDetails(context);

    expect(context.getFailureMessage()).toContain("__tests__/doesnotexist' does not exist.");
});
