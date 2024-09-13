const assert = require('assert');
const vscode = require('vscode');
const ColorfulPrint = require('../../src/extension'); // Adjust the path if necessary

// Ensure that Mocha functions are loaded correctly
suite('ColorfulPrint Extension Tests', function () {
    let colorfulPrint;
    let editor;

    suiteSetup(async function () {
        // Activate the extension and set up the editor
        const extension = vscode.extensions.getExtension('AliYaman.python-colorful-print');
        await extension.activate();

        colorfulPrint = new ColorfulPrint();
        editor = vscode.window.activeTextEditor;

        if (!editor) {
            // Create a new untitled document
            await vscode.commands.executeCommand('workbench.action.files.newUntitledFile');
            editor = vscode.window.activeTextEditor;
        }
    });

    teardown(async function () {
        // Clear editor after each test
        const document = editor.document;
        const allText = new vscode.Range(
            document.positionAt(0),
            document.positionAt(document.getText().length)
        );
        await editor.edit(editBuilder => editBuilder.delete(allText));

        // Reset settings after each test
        await vscode.workspace.getConfiguration('python-colorful-print').update('keyColorMode', 'random', true);
        await vscode.workspace.getConfiguration('python-colorful-print').update('valueColorMode', 'random', true);
        await vscode.workspace.getConfiguration('python-colorful-print').update('enableColor', true, true);
    });

    test('should retrieve the active editor', function () {
        assert.ok(editor, 'Editor should be active');
    });

    test('should insert a print statement for a selected variable with custom colors', async function () {
        // Set custom color settings
        await vscode.workspace.getConfiguration('python-colorful-print').update('keyColorMode', 'custom', true);
        await vscode.workspace.getConfiguration('python-colorful-print').update('keyColorCustom', '#FF0000', true);
        await vscode.workspace.getConfiguration('python-colorful-print').update('valueColorMode', 'custom', true);
        await vscode.workspace.getConfiguration('python-colorful-print').update('valueColorCustom', '#00FF00', true);

        // Insert some text in the editor
        await editor.edit(editBuilder => editBuilder.insert(new vscode.Position(0, 0), 'a = 5\n'));

        // Simulate selecting 'a' and inserting a print statement
        editor.selection = new vscode.Selection(0, 0, 0, 1); // Selecting 'a'
        const text = editor.document.getText(editor.selection);
        const printStatement = colorfulPrint.insertPrintCommand(text);

        assert.ok(printStatement.includes('print'), 'The inserted text should include a print statement');
        assert.ok(printStatement.includes('\\033[38;2;255;0;0m'), 'Key color should be red (#FF0000)');
        assert.ok(printStatement.includes('\\033[38;2;0;255;0m'), 'Value color should be green (#00FF00)');
    });

    test('should insert a print statement with random colors', async function () {
        // Ensure random colors are selected
        await vscode.workspace.getConfiguration('python-colorful-print').update('keyColorMode', 'random', true);
        await vscode.workspace.getConfiguration('python-colorful-print').update('valueColorMode', 'random', true);

        await editor.edit(editBuilder => editBuilder.insert(new vscode.Position(0, 0), 'b = 10\n'));

        // Simulate selecting 'b' and inserting a print statement
        editor.selection = new vscode.Selection(0, 0, 0, 1); // Selecting 'b'
        const text = editor.document.getText(editor.selection);
        const printStatement = colorfulPrint.insertPrintCommand(text);

        assert.ok(printStatement.includes('print'), 'The inserted text should include a print statement');
        assert.ok(printStatement.includes('\\033[38;2;'), 'ANSI color escape code should be present for random color');
    });

    test('should respect indentation when inserting a print statement', async function () {
        await editor.edit(editBuilder => editBuilder.insert(new vscode.Position(0, 0), 'def test_func():\n    value = 5\n'));

        // Simulate selecting 'value' and inserting a print statement
        editor.selection = new vscode.Selection(1, 4, 1, 9); // Selecting 'value'
        const text = editor.document.getText(editor.selection);
        const indentationLevel = colorfulPrint.getIndentationLevel(1); // Line 1 is indented

        colorfulPrint.printText(colorfulPrint.insertPrintCommand(text), indentationLevel);

        const documentText = editor.document.getText();
        assert.ok(documentText.includes('    print'), 'Print statement should be indented to match function scope');
    });

    test('should remove all print statements', async function () {
        await editor.edit(editBuilder => editBuilder.insert(new vscode.Position(0, 0), 'print("test")\nprint("test2")\n'));

        colorfulPrint.removeAllPrintStatements();
        const documentText = editor.document.getText();

        assert.strictEqual(documentText.includes('print'), false, 'All print statements should be removed');
    });
});
