#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Path to the temporary file to store the commits list
const tempFilePath = join(__dirname, '.commits_cache');

// Function to get the commits list
const getCommits = (): string[] => {
    if (existsSync(tempFilePath)) {
        // Read the commits list from the temporary file
        return readFileSync(tempFilePath, 'utf-8').split('\n').filter(hash => hash);
    } else {
        // Calculate the commits list and store it in the temporary file
        const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
        const output = execSync(`git --no-pager log --pretty=oneline --reverse ${branch}`).toString();
        const commits = output.split('\n').map(line => line.split(' ')[0]).filter(hash => hash);
        writeFileSync(tempFilePath, commits.join('\n'));
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
const getCurrentCommit = (): string => {
    return execSync('git rev-parse HEAD').toString().trim();
};

// Function to move forward one commit
const moveForward = () => {
    const current = getCurrentCommit();
    const currentIndex = commits.indexOf(current);

    if (currentIndex < commits.length - 1) {
        execSync(`git checkout ${commits[currentIndex + 1]}`, { stdio: 'inherit' });
    } else {
        console.log('Already at the latest commit.');
    }
    printLocation();
};

// Function to move backward one commit
const moveBackward = () => {
    const current = getCurrentCommit();
    const currentIndex = commits.indexOf(current);

    if (currentIndex > 0) {
        execSync(`git checkout ${commits[currentIndex - 1]}`, { stdio: 'inherit' });
    } else {
        console.log('Already at the oldest commit.');
    }
    printLocation();
};

// Function to compare current commit with the next one
const compareForward = () => {
    const current = getCurrentCommit();
    const currentIndex = commits.indexOf(current);

    if (currentIndex < commits.length - 1) {
        execSync(`git diff ${commits[currentIndex]} ${commits[currentIndex + 1]}`, { stdio: 'inherit' });
    } else {
        console.log('Already at the latest commit.');
    }
};

// Function to compare current commit with the previous one
const compareBackward = () => {
    const current = getCurrentCommit();
    const currentIndex = commits.indexOf(current);

    if (currentIndex > 0) {
        execSync(`git diff ${commits[currentIndex]} ${commits[currentIndex - 1]}`, { stdio: 'inherit' });
    } else {
        console.log('Already at the oldest commit.');
    }
};

// Function to reset the cache
const resetCache = () => {
    writeFileSync(tempFilePath, '');
};

// Function to move to the newest commit
const moveNewest = () => {
    execSync(`git checkout ${commits[commits.length - 1]}`, { stdio: 'inherit' });
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
            } else {
                moveForward();
            }
            break;
        case 'backward':
            if (option === '--compare') {
                compareBackward();
            } else {
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