const path = require('path');
const assert = require('assert');
const { runTests } = require('@vscode/test-electron');

describe('ColorfulPrint Extension Tests', function () {
    this.timeout(10000); // Give enough time for the extension to activate

    before(async function () {
        // Define the path to the extension development root and test workspace
        const extensionDevelopmentPath = path.resolve(__dirname, '../');
        const extensionTestsPath = path.resolve(__dirname, './suite/index'); // Adjust path as necessary

        try {
            // Run the VSCode extension tests
            await runTests({ extensionDevelopmentPath, extensionTestsPath });
        } catch (err) {
            console.error('Failed to run tests');
            process.exit(1);
        }
    });

    it('should activate the extension and run tests', function () {
        // Placeholder test for running the suite
        assert.ok(true, 'Extension activated and tests executed');
    });
});
