const vscode = require('vscode');

class ColorfulPrint {
    getEditor() {
        return vscode.window.activeTextEditor;
    }

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

    printText(text) {
        const editor = this.getEditor();
        const selection = editor.selection;
        const range = new vscode.Range(selection.start, selection.end);
        editor.edit((editBuilder) => {
            editBuilder.replace(range, text);
        });
    }

    insertPrintCommand(text) {
        const { keyColor, valueColor } = this.getConfiguredColors();
        let logToInsert;
        if (keyColor && valueColor) {
            logToInsert = `print('\\033[38;2;${this.hexToRGB(keyColor)}m'+'${text}: ' + '\\033[38;2;${this.hexToRGB(valueColor)}m', ${text}, '\\033[0m')`;
        } else {
            logToInsert = `print('${text}:', ${text})`;
        }
        return logToInsert;
    }

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

    extractVariables(text) {
        // A basic pattern to capture variable assignments in Python.
        const variableRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*.*$/gm;
        const variables = [];
        let match;
        while ((match = variableRegex.exec(text)) !== null) {
            variables.push(match[1]);
        }
        return variables;
    }

    hexToRGB(hex) {
        let bigint = parseInt(hex.substring(1), 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;
        return `${r};${g};${b}`;
    }

    getRandomColor() {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return `#${randomColor.padStart(6, '0')}`;
    }
}

function activate(context) {
    const colorfulPrint = new ColorfulPrint();

    let disposablePrintCommand = vscode.commands.registerCommand('python-colorful-print.colorfulPrint', () => {
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

    let disposablePrintAllVariables = vscode.commands.registerCommand('python-colorful-print.printAllVariables', () => {
        colorfulPrint.addPrintForAllVariables();
    });

    let disposableRemoveAllPrints = vscode.commands.registerCommand('python-colorful-print.removeAllPrints', () => {
        colorfulPrint.removeAllPrintStatements();
    });

    context.subscriptions.push(disposablePrintCommand, disposablePrintAllVariables, disposableRemoveAllPrints);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
