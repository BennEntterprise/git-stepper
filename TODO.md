# TODO

This list is in lose order of precedence but not a strict requirement.

- doc(printHelp): should be cleaner, perhaps use [commander](https://www.npmjs.com/package/commander)
  - ensure that 0 args also prints the help
- refactor(index): do some codesplitting
- refactor(handleCommand): each switch statement should have its own function.
- feat(removeCache): implement atomic movements, without changing the git history, AND without using a cache file. The running of this script should be idempotent.
- doc(printLocation): Cleanup this output.
- Add commit template based on conventional commits (include some helpful info on how to fill it out.)
- Add Husky for git hook management
- Add a commit-msg hook to verify it follows conventional commits. 
- Integrate [changesets support](https://github.com/changesets/changesets) into this project
- Feat(config): allow the consumer to turn off viewing package.json

# DONE
- 2024-08-17 T 22:00:55 Extract help text to a dedicated function.
- 2024-08-17 T 22:01:01 Codesplit the `main` function.