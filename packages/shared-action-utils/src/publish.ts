// Plan:
// * Get all packages that have actions
// * Get their package version
// * See if there is an existing tag for that version (taking into consideration the changesets tagging structure for multi-package repos - packagename@version e.g. add-changeset@0.1.0)
// * Copy and commit the relevant distributable files to their relevant action folder
// * Commit the changes to the relevant major branch for each action individually, taking into consideration each actions version
//   e.g. add-changeset@1.1.1 would be committed to v1 branch, find-and-replace-all@2.0.1 would be committed to v2 branch
// * Push branches with follow tags
// * Changesets publishing will perform the actual tag for us, and theoretically it should hit the right commit?
console.log("publish!");

export {};
