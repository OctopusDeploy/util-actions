# util-actions

A set of utility actions for use in GitHub action workflows.

## Usage

Actions in this repo can be used by referencing the folder in which they live and a tag e.g.

```yml
- uses: OctopusDeploy/util-actions/find-and-replace-all@find-and-replace-all.0.1.0
```

Note: At the moment only specific tags are supported, there is no major version available.

## Actions

### `add-changeset`

This action allows you to add a [changeset](https://github.com/changesets/changesets) to your project to help with automation scenarios, particularly around pre-release package creation and publishing. The action will search your repository to find any packages and add a changeset with the configured SemVer type and summary message to your repo. Note this action does not commit the changeset, it only creates the file for consumption within the rest of your workflow.

For example you might to create a set of pre-release npm packages for each commit to the `main` branch or in a PR and you want these all to have the same version with all the dependencies aligned correctly. Versioning your packages with changesets normally will only bump any packages that are listed in a changeset plus any packages with updated dependencies, you can use this action to automatically add an additional changeset to bump any other packages.

#### Inputs

| Name    | Description                                                                                                                                    | Required |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| type    | The version type to set for each package in the changeset (major, minor, patch)                                                                | Y        |
| summary | The summary for the changeset                                                                                                                  | Y        |
| filter  | A regular expression to filter packages using the name of the package (from package.json)                                                      | N        |
| ignore  | Array of glob patterns to ignore packages with                                                                                                 | N        |
| cwd     | The current working directory where the .changeset folder lives. This is typically the root of your repo and defaults to this if not supplied. | N        |

#### Outputs

| Name          | Description                       |
| ------------- | --------------------------------- |
| changesetName | The name of the changeset created |
| changesetPath | The path to the changeset created |

#### Example

```yml
- uses: OctopusDeploy/util-actions/add-changeset@add-changeset.0.1.0
  with:
    type: patch
    summary: Changeset added for pre-release versioning
    ignore: |
      node_modules/**
      **/__tests__/**
    filter: "@octopusdeploy" # Only include any packages with a scope of @octopusdeploy
```

### `branch-names`

This action allows you to get a sanitised branch name for use in subsequent GitHub action steps. This is a javascript port of @tj-actions/branch-names.

#### Inputs

| Name                                   | Description                                                                                                                                                 | Required |
|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| github_ref                             | This is the input for the github.ref. NOTE: this value should not need to be provided, unless you need to override the default.                             | N        |
| github_base_ref                        | This is the input for the github.base_ref. NOTE: this value should not need to be provided, unless you need to override the default.                        | N        |
| github_head_ref                        | This is the input for the github.head_ref. NOTE: this value should not need to be provided, unless you need to override the default.                        | N        |
| github_event_base_ref                  | This is the input for the github.event.base_ref. NOTE: this value should not need to be provided, unless you need to override the default.                  | N        |
| github_event_name                      | This is the input for the github.event_name. NOTE: this value should not need to be provided, unless you need to override the default.                      | N        |
| github_event_repository_default_branch | This is the input for the github.event.repository.default_branch. NOTE: this value should not need to be provided, unless you need to override the default. | N        |
| tag_prefix_to_remove                   | The prefix on a tag to remove.                                                                                                                              | N        |

#### Outputs

| Name            | Description                                                                        |
|-----------------|------------------------------------------------------------------------------------|
| is_default      | Returns true if current branch is default branch for the repository.               |
| is_tag          | Returns true if the github ref is a tag.                                           |
| default_branch  | Returns the default branch for the repository if the github ref is not a tag.      |
| current_branch  | Returns the current branch for the repository if the github ref is not a tag.      |
| base_ref_branch | Returns the target branch for the repository if the github ref is a pull request.  |
| head_ref_branch | Returns the source branch for the repository if the github ref is a pull request.  |
| ref_branch      | Returns the branch that triggered the workflow run if the github ref is not a tag. |
| tag             | Returns the tag if it was the trigger of the workflow run.                         |

#### Example

```yml
- uses: OctopusDeploy/util-actions/branch-names@branch-names.0.1.0
  with:
    tagPrefixToRemove: v
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
- uses: OctopusDeploy/util-actions/extract-package-details@extract-package-details.0.1.0
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

_String_

String replacement is case-sensitive.

```yml
- uses: OctopusDeploy/util-actions/find-and-replace-all@find-and-replace-all.0.1.0
  with:
    source: The quick brown fox jumps over the lazy dog
    searchString: the
    replace: hooray
```

This will result in an output variable named `value` with a value of `The quick brown fox jumps over hooray lazy dog`. The case-sensitivity here is important to note.

_Regular Expression_

```yml
- uses: OctopusDeploy/util-actions/find-and-replace-all@find-and-replace-all.0.1.0
  with:
    source: The quick brown fox jumps over the lazy dog
    searchRegex: the
    searchRegexFlags: i # case-insensitive
    replace: hooray
```

This will result in an output variable named `value` with a value of `hooray quick brown fox jumps over hooray lazy dog`.
