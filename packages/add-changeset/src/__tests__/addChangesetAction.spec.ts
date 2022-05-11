import { TestGitHubActionContext } from "@octopusdeploy/shared-action-utils";
import { addChangesetAction } from "addChangesetAction";
import { readFile } from "fs/promises";
import path from "path";

test("Changeset with multiple projects gets created successfully", async () => {
    const context = new TestGitHubActionContext();

    context.addInput("type", "patch");
    context.addInput("summary", "This is a test");
    context.addInput("cwd", __dirname);

    await addChangesetAction(context);

    const outputs = context.getOutputs();

    expect(outputs.changesetName).not.toBeUndefined();

    const expectedChangesetDirectory = path.join(__dirname, ".changeset");
    const expectedChangesetPath = path.join(expectedChangesetDirectory, `${outputs.changesetName}.md`);
    expect(outputs.changesetPath).toEqual(expectedChangesetPath);

    const expectedChangesetContents = '---\n"another-package": patch\n"test-package-1": patch\n"test-package-2": patch\n---\n\nThis is a test\n';

    const changesetContents = (await readFile(outputs.changesetPath)).toString();
    expect(changesetContents).toEqual(expectedChangesetContents);
});

test("Project inside ignore path doesn't get included in changeset", async () => {
    const context = new TestGitHubActionContext();

    context.addInput("type", "patch");
    context.addInput("summary", "This is a test");
    context.addInput("cwd", __dirname);
    context.addMultilineInput("ignore", ["**/test-package-2/*", "**/some-other-unknown-package/*"]);

    await addChangesetAction(context);

    const outputs = context.getOutputs();

    expect(outputs.changesetName).not.toBeUndefined();

    const expectedChangesetDirectory = path.join(__dirname, ".changeset");
    const expectedChangesetPath = path.join(expectedChangesetDirectory, `${outputs.changesetName}.md`);
    expect(outputs.changesetPath).toEqual(expectedChangesetPath);

    const expectedChangesetContents = '---\n"another-package": patch\n"test-package-1": patch\n---\n\nThis is a test\n';

    const changesetContents = (await readFile(outputs.changesetPath)).toString();
    expect(changesetContents).toEqual(expectedChangesetContents);
});

test("Project not matching filter doesn't get included in changeset", async () => {
    const context = new TestGitHubActionContext();

    context.addInput("type", "patch");
    context.addInput("summary", "This is a test");
    context.addInput("cwd", __dirname);
    context.addInput("filter", "test-package.*");

    await addChangesetAction(context);

    const outputs = context.getOutputs();

    expect(outputs.changesetName).not.toBeUndefined();

    const expectedChangesetDirectory = path.join(__dirname, ".changeset");
    const expectedChangesetPath = path.join(expectedChangesetDirectory, `${outputs.changesetName}.md`);
    expect(outputs.changesetPath).toEqual(expectedChangesetPath);

    const expectedChangesetContents = '---\n"test-package-1": patch\n"test-package-2": patch\n---\n\nThis is a test\n';

    const changesetContents = (await readFile(outputs.changesetPath)).toString();
    expect(changesetContents).toEqual(expectedChangesetContents);
});

test("Missing type fails action", async () => {
    const context = new TestGitHubActionContext();

    context.addInput("summary", "This is a test");

    await addChangesetAction(context);

    expect(context.getFailureMessage()).toEqual("Input required and not supplied: type");
});

test("Invalid type fails action", async () => {
    const context = new TestGitHubActionContext();

    context.addInput("type", "whatevs");
    context.addInput("summary", "This is a test");

    await addChangesetAction(context);

    expect(context.getFailureMessage()).toEqual("Type must be one of 'major', 'minor' or 'patch'");
});

test("When cwd is not provided defaults to current directory", async () => {
    const context = new TestGitHubActionContext();

    context.addInput("type", "patch");
    context.addInput("summary", "This is a test");
    context.addInput("filter", "test-package.*");

    await addChangesetAction(context);

    console.log(context);
    const outputs = context.getOutputs();

    expect(outputs.changesetName).not.toBeUndefined();

    const cwd = process.cwd();
    const expectedChangesetDirectory = path.join(cwd, ".changeset");
    const expectedChangesetPath = path.join(expectedChangesetDirectory, `${outputs.changesetName}.md`);
    expect(outputs.changesetPath).toEqual(expectedChangesetPath);

    const expectedChangesetContents = '---\n"test-package-1": patch\n"test-package-2": patch\n---\n\nThis is a test\n';

    const changesetContents = (await readFile(outputs.changesetPath)).toString();
    expect(changesetContents).toEqual(expectedChangesetContents);
});
