const assert = require('assert');
const vscode = require('vscode');
const ColorfulPrint = require('../src/extension');  // Assuming extension.js is in the src/ folder.

describe('ColorfulPrint Extension Tests', function () {

    // Ensure the editor is available for testing.
    before(async function () {
        const document = await vscode.workspace.openTextDocument({ content: 'var1 = 10\nvar2 = 20\n' });
        await vscode.window.showTextDocument(document);
    });

    // Test: Check if the editor is correctly retrieved.
    it('should retrieve the active editor', function () {
        const colorfulPrint = new ColorfulPrint();
        const editor = colorfulPrint.getEditor();
        assert.ok(editor, 'Editor should be active');
    });

    // Test: Check if print statements are inserted.
    it('should insert print statement for selected variable', function () {
        const colorfulPrint = new ColorfulPrint();
        const editor = colorfulPrint.getEditor();

        // Select a variable and insert the print statement.
        editor.selection = new vscode.Selection(0, 0, 0, 5); // Selecting 'var1'
        const text = editor.document.getText(editor.selection);
        const printStatement = colorfulPrint.insertPrintCommand(text);

        assert.strictEqual(printStatement.includes('print'), true, 'The inserted text should include a print statement');
    });

    // Test: Check if all variables are printed.
    it('should insert print statements for all variables in the document', function (done) {
        const colorfulPrint = new ColorfulPrint();
        const editor = colorfulPrint.getEditor();

        vscode.commands.executeCommand('python-colorful-print.printAllVariables').then(() => {
            const newText = editor.document.getText();
            assert.ok(newText.includes('var1') && newText.includes('var2'), 'All variables should have a print statement');
            done();
        });
    });

    // Test: Check if all print statements are removed.
    it('should remove all print statements from the document', function (done) {
        const colorfulPrint = new ColorfulPrint();
        const editor = colorfulPrint.getEditor();

        vscode.commands.executeCommand('python-colorful-print.removeAllPrints').then(() => {
            const newText = editor.document.getText();
            assert.strictEqual(/print\(.*?\)/.test(newText), false, 'There should be no print statements left');
            done();
        });
    });

});
