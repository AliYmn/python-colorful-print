const vscode = require('vscode');

/**
 * Class responsible for colorful print functionality in VSCode.
 */
class ColorfulPrint {

    /**
     * Retrieves the active text editor instance.
     * @returns {vscode.TextEditor} The active text editor.
     */
    getEditor() {
        return vscode.window.activeTextEditor;
    }

    /**
     * Retrieves the configured colors for key (variable name) and value (variable value).
     * If coloring is disabled, returns null for both keyColor and valueColor.
     * @returns {Object} An object containing keyColor and valueColor.
     */
    getConfiguredColors() {
        const isColorEnabled = vscode.workspace.getConfiguration('python-colorful-print').get('enableColor');
        if (!isColorEnabled) {
            return { keyColor: null, valueColor: null };
        }

        const keyColorMode = vscode.workspace.getConfiguration('python-colorful-print').get('keyColorMode');
        const valueColorMode = vscode.workspace.getConfiguration('python-colorful-print').get('valueColorMode');

        const keyColor = keyColorMode === 'random' ? this.getRandomColor() : vscode.workspace.getConfiguration('python-colorful-print').get('keyColorCustom');
        const valueColor = valueColorMode === 'random' ? this.getRandomColor() : vscode.workspace.getConfiguration('python-colorful-print').get('valueColorCustom');

        return { keyColor, valueColor };
    }

    /**
     * Detects the indentation level for a specific line in the editor.
     * @param {number} line The line number to check.
     * @returns {number} The number of spaces at the start of the line.
     */
    getIndentationLevel(line) {
        const editor = this.getEditor();
        const text = editor.document.lineAt(line).text;
        const match = text.match(/^(\s*)/);
        return match ? match[1].length : 0; // Return the length of leading spaces
    }

    /**
     * Inserts the generated print statement after the selected variable, respecting the indentation.
     * @param {string} text The text to insert into the editor.
     * @param {number} indentationLevel The number of spaces for indentation.
     */
    printText(text, indentationLevel) {
        const editor = this.getEditor();
        const selection = editor.selection;
        const position = selection.active;

        // Calculate indentation using the given level
        const indentation = ' '.repeat(indentationLevel);
        const newText = `${indentation}${text}\n`;

        const newPosition = new vscode.Position(position.line + 1, 0);
        editor.edit((editBuilder) => {
            editBuilder.insert(newPosition, newText); // Ensure it's inserted on a new line
        });
    }

    /**
     * Inserts a print statement for the selected variable with the configured key and value colors and line information.
     * @param {string} text The variable name to print.
     * @returns {string} The generated print statement with line information.
     */
    insertPrintCommand(text) {
        const editor = vscode.window.activeTextEditor;
        const lineNumber = editor.selection.active.line + 1;
        const { keyColor, valueColor } = this.getConfiguredColors();

        if (keyColor && valueColor) {
            return `print('==> Line ${lineNumber}: \\033[38;2;${this.hexToRGB(keyColor)}m[${text}]\\033[0m = \\033[38;2;${this.hexToRGB(valueColor)}m', ${text}, '\\033[0m')`;
        }

        return `print('==> Line ${lineNumber}: [${text}] =', ${text})`;
    }

    /**
     * Removes all print statements and the corresponding line if it becomes empty.
     */
    removeAllPrintStatements() {
        const editor = this.getEditor();
        const text = editor.document.getText();
        const lines = text.split(/\r?\n/);
        const newLines = lines.map(line => {
            const printStatementRegex = /print\([^\)]*\)/;
            if (printStatementRegex.test(line)) {
                const newLine = line.replace(printStatementRegex, '').trim();
                return newLine.length > 0 ? newLine : null;
            }
            return line;
        }).filter(line => line !== null);

        const newText = newLines.join('\n');
        editor.edit(editBuilder => {
            const fullRange = new vscode.Range(
                editor.document.positionAt(0),
                editor.document.positionAt(text.length)
            );
            editBuilder.replace(fullRange, newText);
        });
    }

    /**
     * Converts a hex color code to an RGB format usable by ANSI escape codes.
     * @param {string} hex The hex color code (e.g., #FF0000).
     * @returns {string} The RGB equivalent as 'r;g;b'.
     */
    hexToRGB(hex) {
        const bigint = parseInt(hex.substring(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = (bigint & 255);
        return `${r};${g};${b}`;
    }

    /**
     * Generates a random hex color.
     * @returns {string} A random hex color code.
     */
    getRandomColor() {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return `#${randomColor.padStart(6, '0')}`;
    }
}

/**
 * Activates the extension and registers commands.
 * @param {vscode.ExtensionContext} context The extension context.
 */
function activate(context) {
    const colorfulPrint = new ColorfulPrint();

    const disposablePrintCommand = vscode.commands.registerCommand('python-colorful-print.colorfulPrint', () => {
        const editor = colorfulPrint.getEditor();
        const selection = editor.selection;
        const text = editor.document.getText(selection);
        const indentationLevel = colorfulPrint.getIndentationLevel(selection.start.line);

        try {
            if (text) {
                const logToInsert = colorfulPrint.insertPrintCommand(text);
                colorfulPrint.printText(logToInsert, indentationLevel);
            } else {
                vscode.window.showErrorMessage("Please select a variable");
            }
        } catch (error) {
            console.error('Error in colorfulPrint command:', error);
            vscode.window.showErrorMessage(`Error inserting print statement: ${error.message}`);
        }
    });

    const disposableRemoveAllPrints = vscode.commands.registerCommand('python-colorful-print.removeAllPrints', () => {
        try {
            colorfulPrint.removeAllPrintStatements();
        } catch (error) {
            console.error('Error in removeAllPrints command:', error);
            vscode.window.showErrorMessage(`Error removing print statements: ${error.message}`);
        }
    });

    context.subscriptions.push(disposablePrintCommand, disposableRemoveAllPrints);
}

/**
 * Deactivates the extension.
 */
function deactivate() {}

module.exports = {
    activate,
    deactivate
};
