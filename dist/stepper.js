#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = require("path");
// Path to the temporary file to store the commits list
const tempFilePath = (0, path_1.join)(__dirname, '.commits_cache');
// Function to get the commits list
const getCommits = () => {
    if ((0, fs_1.existsSync)(tempFilePath)) {
        // Read the commits list from the temporary file
        return (0, fs_1.readFileSync)(tempFilePath, 'utf-8').split('\n').filter(hash => hash);
    }
    else {
        // Calculate the commits list and store it in the temporary file
        const branch = (0, child_process_1.execSync)('git rev-parse --abbrev-ref HEAD').toString().trim();
        const output = (0, child_process_1.execSync)(`git --no-pager log --pretty=oneline --reverse ${branch}`).toString();
        const commits = output.split('\n').map(line => line.split(' ')[0]).filter(hash => hash);
        (0, fs_1.writeFileSync)(tempFilePath, commits.join('\n'));
        return commits;
    }
};
// Cache the commits list
const commits = getCommits();
// Function to print your current location in the git history
const printLocation = () => {
    const current = getCurrentCommit();
    const currentIndex = commits.indexOf(current);
    console.log(`Commit ${currentIndex + 1} of ${commits.length}`);
};
// Function to get the current commit hash
const getCurrentCommit = () => {
    return (0, child_process_1.execSync)('git rev-parse HEAD').toString().trim();
};
// Function to move forward one commit
const moveForward = () => {
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
    const current = getCurrentCommit();
    const currentIndex = commits.indexOf(current);
    if (currentIndex > 0) {
        (0, child_process_1.execSync)(`git diff ${commits[currentIndex]} ${commits[currentIndex - 1]}`, { stdio: 'inherit' });
    }
    else {
        console.log('Already at the oldest commit.');
    }
};
// Function to reset the cache
const resetCache = () => {
    (0, fs_1.writeFileSync)(tempFilePath, '');
};
// Function to move to the newest commit
const moveNewest = () => {
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
        case 'reset':
            resetCache();
            break;
        default:
            console.log('Usage: my-stepper {forward|backward} [--compare]');
            break;
    }
};
main();
