# @octopusdeploy/find-and-replace-all

## 0.4.0

### Minor Changes

-   1edc8ab: Update to node 24.11.1

### Patch Changes

-   Updated dependencies [1edc8ab]
    -   @octopusdeploy/shared-action-utils@0.4.0

## 0.3.1

### Patch Changes

-   a382208: Security update: Pin form-data to version 3.0.4 or higher

    This release addresses a security vulnerability in the form-data dependency by adding a pnpm override to ensure all packages use form-data version 3.0.4 or higher. The form-data package was previously resolved to version 3.0.1 as a transitive dependency through jsdom.

    **Security Fix:**

    -   Added pnpm override for `form-data@<3.0.4` to use `^3.0.4`
    -   Ensures all transitive dependencies use the secure version of form-data
    -   Resolves security advisory: https://github.com/OctopusDeploy/util-actions/security/dependabot/22

    **Technical Details:**

    -   No API changes or breaking changes
    -   All existing functionality remains unchanged
    -   Only the underlying form-data dependency version has been updated for security

-   Updated dependencies [a382208]
    -   @octopusdeploy/shared-action-utils@0.3.1

## 0.3.0

### Minor Changes

-   d53723c: Update to node 20

### Patch Changes

-   46607ba: Updating package names to include @octopusdeploy/ prefix for security reasons.
-   Updated dependencies [d53723c]
    -   @octopusdeploy/shared-action-utils@0.3.0

## 0.2.0

### Minor Changes

-   7a4dfcd: Updating @actions/core to 1.10.0 to remove warning about the use of deprecated functions

### Patch Changes

-   Updated dependencies [7a4dfcd]
    -   @octopusdeploy/shared-action-utils@0.2.0

## 0.1.0

### Minor Changes

-   ff25e33: Adds find-and-replace-all action

### Patch Changes

-   Updated dependencies [227fad4]
    -   @octopusdeploy/shared-action-utils@0.1.0
