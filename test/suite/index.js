const assert = require('assert');
const vscode = require('vscode');
const ColorfulPrint = require('../../src/extension'); // Adjust the path to point to your extension file

// Mocha's describe, it, before, etc., are available globally, no need to import them.
describe('ColorfulPrint Extension Tests', function () {

    it('should retrieve the active editor', async function () {
        const colorfulPrint = new ColorfulPrint();
        const editor = colorfulPrint.getEditor();
        assert.ok(editor, 'Editor should be active');
    });

    it('should insert a print statement for selected variable', async function () {
        const colorfulPrint = new ColorfulPrint();
        const editor = colorfulPrint.getEditor();

        // Simulate selecting a variable and insert the print statement
        editor.selection = new vscode.Selection(0, 0, 0, 5); // Selecting 'var1'
        const text = editor.document.getText(editor.selection);
        const printStatement = colorfulPrint.insertPrintCommand(text);

        assert.ok(printStatement.includes('print'), 'The inserted text should include a print statement');
    });
});
