// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let commentsFolded = true;

function toggleFold(unfold: boolean) {
	// Get the active text editor
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		// Get the active text editor's active document
		const document = editor.document;

		// Collect lines to fold or unfold
		const lines: number[] = [];
		// Go through each line
		for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
			if (lineIsComment(document, lineIndex)) {
				console.log(lineIndex)
				lines.push(lineIndex)
			}
		}

		if (unfold) {
			vscode.commands.executeCommand("editor.unfold", { selectionLines: lines });
		} else {
			// Things get weird if you fold something that is already folded, so unfold it then fold it again
			// just in case the folding was changed outside of doggle
			vscode.commands.executeCommand("editor.unfold", { selectionLines: lines });
			vscode.commands.executeCommand("editor.fold", { selectionLines: lines });
		}
	}
}

function lineIsComment(document: vscode.TextDocument, lineIndex: number) {
	// If in the future more languages are supported, this will make it easier to add them
	if (document.languageId === 'python') {
		// If the first non white space character is """ assume the line is a docstring
		const currentLineGood = document.lineAt(lineIndex).text.trim().startsWith('"""') && !document.lineAt(lineIndex).text.trim().endsWith('"""');
		// If there is no previous line or there is a previous line that ends with a colon the previous line is good
		const prevLineGood = lineIndex === 0 ? true : document.lineAt(lineIndex - 1).text.trim().endsWith(':');
		return currentLineGood && prevLineGood;
	} else {
		vscode.window.showInformationMessage(`Doggle does not yet support ${document.languageId}`);
		return false;
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "doggle" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('doggle.doggle', () => {
		toggleFold(commentsFolded)
		commentsFolded = !commentsFolded

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
