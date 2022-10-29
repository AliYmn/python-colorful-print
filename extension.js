const vscode = require('vscode');

const printText = (text) => {
    const editor = vscode.window.activeTextEditor;
    const selection = editor.selection;
	// a bottom line
    const range = new vscode.Range(selection.start, selection.end);
	// print it!
    editor.edit((editBuilder) => {
        editBuilder.replace(range, text);
    });
};

function activate(context) {
	let disposable = vscode.commands.registerCommand('python-colorful-print.colorfulPrint', function () {
		const textEditor = vscode.window.activeTextEditor;
		const selectText = textEditor.selection;
        const text = textEditor.document.getText(selectText);
		text ?
		vscode.commands.executeCommand('editor.action.insertLineAfter')
			.then(() => {
				const logToInsert = `print('\\033[91m'+'${text}: ' + '\\033[92m', ${text})`;
				printText(logToInsert);
			})
		: vscode.window.showErrorMessage("please select a variable!");
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
