const path = require('path');
const { runTests } = require('@vscode/test-electron');

async function main() {
    try {
        // The path to the extension's development folder
        const extensionDevelopmentPath = path.resolve(__dirname, '../');

        // The path to the test suite (test/suite/index.js)
        const extensionTestsPath = path.resolve(__dirname, './suite/index');

        // Run the extension tests
        await runTests({ extensionDevelopmentPath, extensionTestsPath });
    } catch (err) {
        console.error('Failed to run tests');
        process.exit(1);
    }
}

main();
