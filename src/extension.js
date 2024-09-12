const vscode = require('vscode');

class ColorfulPrint {
    getEditor() {
        return vscode.window.activeTextEditor;
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
        if (text) {
            vscode.commands.executeCommand('editor.action.insertLineAfter')
                .then(() => {
                    const logToInsert = `print('\\033[91m'+'${text}: ' + '\\033[92m', ${text}, '\\033[0m')`;
                    this.printText(logToInsert);
                });
        } else {
            vscode.window.showErrorMessage("Please select a variable!");
        }
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
