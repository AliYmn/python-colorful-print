const assert = require('assert');
const vscode = require('vscode');
const ColorfulPrint = require('../src/extension');

suite('ColorfulPrint Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Sample text print', () => {
        const colorfulPrint = new ColorfulPrint();
        const testText = 'testVar';
        const expectedOutput = `print('\\033[91m'+'${testText}: ' + '\\033[92m', ${testText}, '\\033[0m')`;
        assert.strictEqual(colorfulPrint.generatePrintCommand(testText), expectedOutput);
    });

    test('No variable selected', () => {
        const colorfulPrint = new ColorfulPrint();
        const selectedText = '';
        assert.throws(() => colorfulPrint.insertPrintCommand(selectedText), Error, "Please select a variable!");
    });
});
