# util-actions

A set of utility actions for use in GitHub action workflows.

## Usage

Actions in this repo can be used by referencing the folder in which they live e.g.

```yml
- uses: OctopusDeploy/util-actions/find-and-replace-all@v0
```

### Major version branches

To use the latest minor/patch version instead a major version of the action, use the `v{version}` reference as in the example above.

### Specific versions

To use a specific version of an action, reference it using tags created on the repo in the format `{action}@{version}`, e.g.

```yml
- uses: OctopusDeploy/util-actions/find-and-replace-all@find-and-replace-all@0.1.0
```

## Actions

### `add-changeset`

This action allows you to add a [changeset](https://github.com/changesets/changesets) to your project to help with automation scenarios, particularly around pre-release package creation and publishing. The action will search your repository to find any packages and add a changeset with the configured SemVer type and summary message to your repo. Note this action does not commit the changeset, it only creates the file for consumption within the rest of your workflow.

For example you might to create a set of pre-release npm packages for each commit to the `main` branch or in a PR and you want these all to have the same version with all the dependencies aligned correctly. Versioning your packages with changesets normally will only bump any packages that are listed in a changeset plus any packages with updated dependencies, you can use this action to automatically add an additional changeset to bump any other packages.

#### Inputs

| Name    | Description                                                                                                                                    | Required |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| type    | The version type to set for each package in the changeset (major, minor, patch)                                                                | Y        |
| summary | The summary for the changeset                                                                                                                  | Y        |
| filter  | A regular expression to filter packages by                                                                                                     | N        |
| ignore  | Array of glob patterns to ignore packages with                                                                                                 | N        |
| cwd     | The current working directory where the .changeset folder lives. This is typically the root of your repo and defaults to this if not supplied. | N        |

#### Outputs

| Name          | Description                       |
| ------------- | --------------------------------- |
| changesetName | The name of the changeset created |
| changesetPath | The path to the changeset created |

#### Example

```yml
- uses: OctopusDeploy/util-actions/add-changeset@v0
  with:
    type: patch
    summary: Changeset added for pre-release versioning
    ignore: |
      node_modules/**
      **/__tests__/**
    filter: "@octopusdeploy/" # Only include any packages with a scope of @octopusdeploy
```

### `extract-package-details`

This action allows you to extract the `name` and `version` from within an npm package given the path to the directory of the package.

#### Inputs

| Name | Description                                            | Required |
| ---- | ------------------------------------------------------ | -------- |
| path | Path to the directory containing the package.json file | Y        |

#### Outputs

| Name    | Description                |
| ------- | -------------------------- |
| name    | The name of the package    |
| version | The version of the package |

#### Example

```yml
- uses: OctopusDeploy/util-actions/extract-package-details@v0
  with:
    path: /path/to/my/package
```

### `find-and-replace-all`

This action allows you to find and replace all instances of a string using a direct string search or a regular expression.

#### Inputs

| Name             | Description                                                                   | Required |
| ---------------- | ----------------------------------------------------------------------------- | -------- |
| source           | The text to have replacement run on it                                        | Y        |
| searchString     | The string to search for                                                      | N        |
| searchRegex      | A regular expression to search with                                           | N        |
| searchRegexFlags | Flags to add to the regular expression. The global flag will always be added. | N        |
| replace          | The text to replace with                                                      | Y        |

#### Outputs

| Name  | Description                                            |
| ----- | ------------------------------------------------------ |
| value | The new string after find-and-replace-all has been run |

#### Example

*String*

String replacement is case-sensitive.

```yml
- uses: OctopusDeploy/util-actions/find-and-replace-all@v0
  with:
    source: The quick brown fox jumps over the lazy dog
    searchString: the
    replace: hooray
```

This will result in an output variable named `value` with a value of `The quick brown fox jumps over hooray lazy dog`. The case-sensitivity here is important to note.

*Regular Expression*

```yml
- uses: OctopusDeploy/util-actions/find-and-replace-all@v0
  with:
    source: The quick brown fox jumps over the lazy dog
    searchRegex: the
    searchRegexFlags: i # case-insensitive
    replace: hooray
```

This will result in an output variable named `value` with a value of `hooray quick brown fox jumps over hooray lazy dog`.