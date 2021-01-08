const vscode = require('vscode');
const handleBox = require('./comp/handleBox');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {


	console.log('Congratulations, your extension "benchme" is now active!');


	context.subscriptions.push(vscode.commands.registerCommand('benchme.addCase', function () {
		handleBox.getInput("Tsot");
		
	}));
}
// @ts-ignore
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	// @ts-ignore
	activate,
	deactivate
}