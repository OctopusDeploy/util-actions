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
    context.addInput("path", "./src/__tests__/testPackageDoesntExist");

    extractPackageDetails(context);

    expect(context.getFailureMessage()).toContain("testPackageDoesntExist/package.json' from 'src/extractPackageDetails.ts'");
});

test("handles path that does not exist", () => {
    const context = new TestGitHubActionContext();
    context.addInput("path", "./src/__tests__/doesnotexist");

    extractPackageDetails(context);
    expect(context.getFailureMessage()).toContain("__tests__/doesnotexist/package.json' from 'src/extractPackageDetails.ts'");
});
