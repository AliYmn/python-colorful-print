const path = require('path');
const { runTests } = require('@vscode/test-electron');

async function main() {
    try {
        // Path to the extension's development folder
        const extensionDevelopmentPath = path.resolve(__dirname, '../');

        // Path to the test suite (should be in test/suite/index.js)
        const extensionTestsPath = path.resolve(__dirname, './suite/index'); // Ensure this path is correct

        // Download VS Code, if necessary, and run the tests
        await runTests({ extensionDevelopmentPath, extensionTestsPath });
    } catch (err) {
        console.error('Failed to run tests:', err);
        process.exit(1);
    }
}

main();
