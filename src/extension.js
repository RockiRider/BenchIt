const vscode = require('vscode');
//const handleBox = require('./comp/handleBox');
const findMethod = require('./comp/findMethod');
const sidebarProvider = require('./comp/SideBarProvider');
const methodStorage = require('./comp/storeMethods');
const mainDisplay = require('./comp/MainPanel');
const closeViewTracker = require('./comp/closeCounter');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

//To Mark when the WebView is closed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const sbprov = new sidebarProvider.SidebarProvider(context.extensionUri);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider("benchMe_sidebar", sbprov))

	console.log('Congratulations, your extension "benchme" is now active!');

	let methodCounter = 1;

	context.subscriptions.push(vscode.commands.registerCommand('benchme.addCase', function () {

		let inputBox = new Promise((resolve, reject) => {
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

		let activeEd = new Promise((resolve,reject)=>{
			let currentActive = vscode.window.activeTextEditor;

			if(!currentActive){
				reject("No Active Editor");
			}else{
				resolve(currentActive);
			}
		})

		function findFunction(name,path) {
			return new Promise(function (resolve,reject) {
			 const found = findMethod.getMethodData(name,path);
			 	if (found){
					if(found =='Error'){
						reject('Error Occured')
					}else{
						resolve(found)
					}
				}else{
					reject(("Not Found"));
				}
			});
		  }

		// Program Proceeds Under Here
		inputBox.then((method) => {

			//Check for active editor first and then reject if need be
			activeEd.then((foundEditor)=>{
				
				findFunction(method,foundEditor).then((data)=>{
					//Function is found from here!

					console.log(data);
					/*
					Command doesnt work in time. Need to use an update method for sidebar!!

					vscode.commands.executeCommand('workbench.view.extension.benchMe_sidebar_view');
					vscode.commands.executeCommand('benchMe_sidebar.focus');
					*/

					//Sends to SideBar
					var _a;
					(_a = sbprov._view) === null || _a === void 0 ? void 0 : _a.webview.postMessage({
						type: "new-function",
						value: {name:method,id:methodCounter},
					})

					//Sends to storage to save
					const methodInfo = new methodStorage.MethodObj(method, methodCounter, data.start, data.finish, data.filePath, data.text);
					methodStorage.pushToStore(methodInfo);
					methodCounter++;


					let loadSaveData = closeViewTracker.getClose();

					//Display Web View and send in the new data, whilst checking if there were any previous tracked functions
					mainDisplay.MainPanel.createOrShow(context.extensionUri);
					if(loadSaveData){
						//Get whole array
						let allData = methodStorage.getStore();
						mainDisplay.MainPanel.currentPanel._panel.webview.postMessage({type: 'load-save',data:allData});
						closeViewTracker.setClose(false);
					}else{
						mainDisplay.MainPanel.currentPanel._panel.webview.postMessage({type: 'new-function',data:methodInfo});
					}

				}).catch((errorMsg)=>{
					//Function not found!
					vscode.window.showWarningMessage('Error! Function not found!');
					console.log("ERROR ON " + errorMsg);
				})
				

			}).catch((errorMsg) =>{
				//Active Editor Not found
				vscode.window.showWarningMessage('Error! No Active Editor');
				console.log("ERROR ON " + errorMsg);
			})
		}).catch((method) => {
			vscode.window.showWarningMessage('Warning! Input not recieved');
			console.log("ERROR ON " + method);

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