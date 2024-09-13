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

    insertPrintCommand() {
        const editor = this.getEditor();
        const selectText = editor.selection;
        const text = editor.document.getText(selectText);

        const { keyColor, valueColor } = this.getConfiguredColors();
        if (text) {
            vscode.commands.executeCommand('editor.action.insertLineAfter')
                .then(() => {
                    let logToInsert;
                    if (keyColor && valueColor) {
                        logToInsert = `print('\\033[38;2;${this.hexToRGB(keyColor)}m'+'${text}: ' + '\\033[38;2;${this.hexToRGB(valueColor)}m', ${text}, '\\033[0m')`;
                    } else {
                        // Plain text print if color is disabled
                        logToInsert = `print('${text}:', ${text})`;
                    }
                    this.printText(logToInsert);
                });
        } else {
            vscode.window.showErrorMessage("Please select a variable!");
        }
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

    let disposable = vscode.commands.registerCommand('python-colorful-print.colorfulPrint', () => {
        colorfulPrint.insertPrintCommand();
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
