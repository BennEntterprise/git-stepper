# Git-Stepper

## Introduction

Have you ever wanted to replay each git commit so you can see step-by-step how a particular project unfolded? Well...look no further!

Git-Stepper will allow you to move and compare your git history one commit at a time. Use it to:

1. Start at the origin of a project and move forward.
2. Start at the latest commit and move backward.
3. "Watch" the iterative process of code being built for a pull request!


## Installation

### Build locally and use yourself (recommended)

This project aims to be usable as an `npx` command, but for now you should install it yourself and then link it for use in whatever project you'd like.

1. `git clone git@github.com:BennEntterprise/git-stepper.git` to get a version of the code
2. `npm i` (this also uses a `prepare` script that will build the project for you 👍)
3. `npm link` to make this available as an executable _anywhere_ on your system.
4. `chmod +x dist/index.js` to allow this to execute.
5. Open a terminal in any git project and run `stepper` or `npx stepper` or `npx stepper --help`to run the help documentation

