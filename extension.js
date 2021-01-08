const vscode = require('vscode');
const handleBox = require('./comp/handleBox');
const SideBarProvider = require('./comp/SideBarProvider');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const sidebarProvider = new SideBarProvider.SidebarProvider(context.extensionUri);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider("benchMe_sidebar", sidebarProvider))

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