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

        const keyColorSetting = vscode.workspace.getConfiguration('python-colorful-print').get('keyColor');
        const valueColorSetting = vscode.workspace.getConfiguration('python-colorful-print').get('valueColor');

        const keyColor = keyColorSetting === 'random' ? this.getRandomColor() : keyColorSetting;
        const valueColor = valueColorSetting === 'random' ? this.getRandomColor() : valueColorSetting;

        return { keyColor, valueColor };
    }

    /**
     * Replaces the selected text in the editor with the given text.
     * @param {string} text The text to insert into the editor.
     */
    printText(text) {
        const editor = this.getEditor();
        const selection = editor.selection;
        const range = new vscode.Range(selection.start, selection.end);
        editor.edit((editBuilder) => {
            editBuilder.replace(range, text);
        });
    }

    /**
     * Inserts a print statement for the selected variable with the configured key and value colors.
     * @param {string} text The variable name to print.
     * @returns {string} The generated print statement.
     */
    insertPrintCommand(text) {
        const { keyColor, valueColor } = this.getConfiguredColors();
        if (keyColor && valueColor) {
            return `print('\\033[38;2;${this.hexToRGB(keyColor)}m'+'${text}: ' + '\\033[38;2;${this.hexToRGB(valueColor)}m', ${text}, '\\033[0m')`;
        }
        return `print('${text}:', ${text})`;
    }

    /**
     * Adds print statements for all variables found in the document.
     */
    addPrintForAllVariables() {
        const editor = this.getEditor();
        const document = editor.document;
        const text = document.getText();
        const variables = this.extractVariables(text);

        editor.edit((editBuilder) => {
            variables.forEach(variable => {
                const logToInsert = this.insertPrintCommand(variable);
                editBuilder.insert(new vscode.Position(document.lineCount, 0), logToInsert + '\n');
            });
        });
    }

    /**
     * Removes all print statements from the document.
     */
    removeAllPrintStatements() {
        const editor = this.getEditor();
        const document = editor.document;
        const text = document.getText();
        const printRegex = /print\(.*?\);?/g;

        const matches = [];
        let match;
        while ((match = printRegex.exec(text)) !== null) {
            matches.push(new vscode.Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length)));
        }

        editor.edit((editBuilder) => {
            matches.forEach(range => editBuilder.delete(range));
        });
    }

    /**
     * Extracts all variables from the provided document text.
     * A variable is considered any valid Python variable assignment.
     * @param {string} text The document text.
     * @returns {Array} An array of variable names.
     */
    extractVariables(text) {
        const variableRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*.*$/gm;
        const variables = [];
        let match;
        while ((match = variableRegex.exec(text)) !== null) {
            variables.push(match[1]);
        }
        return variables;
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
        const b = bigint & 255;
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
        if (text) {
            const logToInsert = colorfulPrint.insertPrintCommand(text);
            colorfulPrint.printText(logToInsert);
        } else {
            vscode.window.showErrorMessage("Please select a variable!");
        }
    });

    const disposablePrintAllVariables = vscode.commands.registerCommand('python-colorful-print.printAllVariables', () => {
        colorfulPrint.addPrintForAllVariables();
    });

    const disposableRemoveAllPrints = vscode.commands.registerCommand('python-colorful-print.removeAllPrints', () => {
        colorfulPrint.removeAllPrintStatements();
    });

    context.subscriptions.push(disposablePrintCommand, disposablePrintAllVariables, disposableRemoveAllPrints);
}

/**
 * Deactivates the extension.
 */
function deactivate() {}

module.exports = {
    activate,
    deactivate
};
