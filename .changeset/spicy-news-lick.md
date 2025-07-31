---
"@octopusdeploy/add-changeset": patch
"@octopusdeploy/current-branch-name": patch
"@octopusdeploy/extract-package-details": patch
"@octopusdeploy/find-and-replace-all": patch
"@octopusdeploy/shared-action-utils": patch
---

Security update: Pin form-data to version 3.0.4 or higher

This release addresses a security vulnerability in the form-data dependency by adding a pnpm override to ensure all packages use form-data version 3.0.4 or higher. The form-data package was previously resolved to version 3.0.1 as a transitive dependency through jsdom.

**Security Fix:**
- Added pnpm override for `form-data@<3.0.4` to use `^3.0.4`
- Ensures all transitive dependencies use the secure version of form-data
- Resolves security advisory: https://github.com/OctopusDeploy/util-actions/security/dependabot/22

**Technical Details:**
- No API changes or breaking changes
- All existing functionality remains unchanged
- Only the underlying form-data dependency version has been updated for security
