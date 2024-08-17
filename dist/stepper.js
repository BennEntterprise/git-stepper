#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
// Function to print your current location in the git history
const printLocation = () => {
    const commits = getCommits();
    const current = getCurrentCommit();
    const currentIndex = commits.indexOf(current);
    console.log(`Commit ${currentIndex + 1} of ${commits.length}`);
};
// Function to get the commit hashes in reverse order
const getCommits = () => {
    const output = (0, child_process_1.execSync)('git --no-pager log --pretty=oneline --reverse').toString();
    return output.split('\n').map(line => line.split(' ')[0]).filter(hash => hash);
};
// Function to get the current commit hash
const getCurrentCommit = () => {
    return (0, child_process_1.execSync)('git rev-parse HEAD').toString().trim();
};
// Function to move forward one commit
const moveForward = () => {
    const commits = getCommits();
    const current = getCurrentCommit();
    const currentIndex = commits.indexOf(current);
    if (currentIndex < commits.length - 1) {
        (0, child_process_1.execSync)(`git checkout ${commits[currentIndex + 1]}`, { stdio: 'inherit' });
    }
    else {
        console.log('Already at the latest commit.');
    }
    printLocation();
};
// Function to move backward one commit
const moveBackward = () => {
    const commits = getCommits();
    const current = getCurrentCommit();
    const currentIndex = commits.indexOf(current);
    if (currentIndex > 0) {
        (0, child_process_1.execSync)(`git checkout ${commits[currentIndex - 1]}`, { stdio: 'inherit' });
    }
    else {
        console.log('Already at the oldest commit.');
    }
    printLocation();
};
// Function to compare current commit with the next one
const compareForward = () => {
    const commits = getCommits();
    const current = getCurrentCommit();
    const currentIndex = commits.indexOf(current);
    if (currentIndex < commits.length - 1) {
        (0, child_process_1.execSync)(`git diff ${commits[currentIndex]} ${commits[currentIndex + 1]}`, { stdio: 'inherit' });
    }
    else {
        console.log('Already at the latest commit.');
    }
};
// Function to compare current commit with the previous one
const compareBackward = () => {
    const commits = getCommits();
    const current = getCurrentCommit();
    const currentIndex = commits.indexOf(current);
    if (currentIndex > 0) {
        (0, child_process_1.execSync)(`git diff ${commits[currentIndex]} ${commits[currentIndex - 1]}`, { stdio: 'inherit' });
    }
    else {
        console.log('Already at the oldest commit.');
    }
};
// Function to move to the newest commit
const moveNewest = () => {
    const commits = getCommits();
    (0, child_process_1.execSync)(`git checkout ${commits[commits.length - 1]}`, { stdio: 'inherit' });
};
// Main logic
const main = () => {
    const args = process.argv.slice(2);
    const command = args[0];
    const option = args[1];
    switch (command) {
        case 'forward':
            if (option === '--compare') {
                compareForward();
            }
            else {
                moveForward();
            }
            break;
        case 'backward':
            if (option === '--compare') {
                compareBackward();
            }
            else {
                moveBackward();
            }
            break;
        case 'newest':
            moveNewest();
            break;
        default:
            console.log('Usage: my-stepper {forward|backward} [--compare]');
            break;
    }
};
main();
