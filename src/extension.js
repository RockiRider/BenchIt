const vscode = require('vscode');
//const handleBox = require('./comp/handleBox');
const findMethod = require('./comp/findMethod');
const sidebarProvider = require('./comp/SideBarProvider');
const methodStorage = require('./comp/storeMethods');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const sbprov = new sidebarProvider.SidebarProvider(context.extensionUri);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider("benchMe_sidebar", sbprov))

	console.log('Congratulations, your extension "benchme" is now active!');

	let methodCounter = 1;

	context.subscriptions.push(vscode.commands.registerCommand('benchme.addCase', function () {
		//handleBox.getInput("Tsot"); Can send stuff to other places!!!

		let p = new Promise((resolve, reject) => {
			const result = vscode.window.showInputBox({
				ignoreFocusOut: true,
				password: false,
				placeHolder: 'Input Function Name On Active Text-Editor',
			});

			if (result) {
				resolve(result);
			} else {
				reject("No Input!");
				console.log("ERR!");
			}
		})

		p.then((method) => {

			//Check for active editor first and then reject if need be


			findMethod.getInput(method);

			//Sends to SideBar
			var _a;
			(_a = sbprov._view) === null || _a === void 0 ? void 0 : _a.webview.postMessage({
				type: "new-function",
				value: method,
			})

			//Sends to storage to save
			const methodInfo = new methodStorage.MethodObj(method,methodCounter,null,null,null,null);
			methodStorage.pushToStore(methodInfo);
			methodCounter++;
		
		}).catch((method) => {
			vscode.window.showWarningMessage('Warning! Input not recieved');
			console.log("ERROR " + method);
		})

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