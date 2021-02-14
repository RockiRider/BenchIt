const vscode = require('vscode');
const findMethod = require('./comp/findMethod');
const sidebarProvider = require('./comp/SideBarProvider');
const methodStorage = require('./comp/storeMethods');
//const mainDisplay = require('./comp/MainPanel');
//const closeViewTracker = require('./comp/closeCounter');


const open = require('open');
const {instance} = require('./comp/objController/serverInstance');
let browserOpened = false;



//import {COMMAND, CONFIGURATION} from './localserver/config';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

//To Mark when the WebView is closed

//const webpage = new ResultsPanel.ResultsPanel();
//const nodeServer = new node.LocalServer(webpage.getHtml());

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	
	const sbprov = new sidebarProvider.SidebarProvider(context.extensionUri);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider("benchMe_sidebar", sbprov));
	instance.createServer();
	

	//currentServer = nodeServer;

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

		let activeEd = new Promise((resolve, reject) => {
			let currentActive = vscode.window.activeTextEditor;

			if (!currentActive) {
				reject("No Active Editor");
			} else {
				resolve(currentActive);
			}
		})

		function findFunction(name, path) {
			return new Promise(function (resolve, reject) {
				const found = findMethod.getMethodData(name, path);
				if (found) {
					if (found == 'Error') {
						reject('Error Occured')
					} else {
						resolve(found)
					}
				} else {
					reject(("Not Found"));
				}
			});
		}

		// Program Proceeds Under Here
		inputBox.then((method) => {

			//Check for active editor first and then reject if need be
			activeEd.then((foundEditor) => {

				//Wait for SideBar to activate so the new Function is registered here too!
				vscode.commands.executeCommand('workbench.view.extension.benchMe_sidebar_view');
				setTimeout(function(){ 
					 
					findFunction(method, foundEditor).then((data) => {
						//Function is found from here! Start the server!
						console.log(data);

						//Sending to Sidebar
						var _a;
						(_a = sbprov._view) === null || _a === void 0 ? void 0 : _a.webview.postMessage({
							type: "new-function",
							value: {
								name: method,
								id: methodCounter
							},
						})

						//Sends to storage to save
						const methodInfo = new methodStorage.MethodObj(method, methodCounter, data.start, data.finish, data.filePath, data.text);
						methodStorage.pushToStore(methodInfo);
						methodCounter++;

						if(browserOpened){
							instance.handleMsg({type: 'new-function',data: methodInfo});
						}else{
							open('http://localhost:52999').then(() =>{
								//Send to new function to server
								instance.handleMsg({type: 'new-function',data: methodInfo});
								browserOpened = true;
							}).catch((error)=>{
								console.log(error);
								console.log("Could not open Browser!");
								vscode.window.showWarningMessage('Error! Could not open Browser!');
							});
						}

						/**
						*  This is all the WebView Compenent which is depcreated!
						*  Unusable due to No WebWorker Support.
						
						let loadSaveData = closeViewTracker.getClose();

						//Display Web View and send in the new data, whilst checking if there were any previous tracked functions
						mainDisplay.MainPanel.createOrShow(context.extensionUri);
						if (loadSaveData) {
							//Get whole array
							let allData = methodStorage.getStore();
							mainDisplay.MainPanel.currentPanel._panel.webview.postMessage({
								type: 'load-save',
								data: allData
							});
							closeViewTracker.setClose(false);
						} else {
							mainDisplay.MainPanel.currentPanel._panel.webview.postMessage({
								type: 'new-function',
								data: methodInfo
							});
						}
						*/

						//STARTS HERE ---------------
						/*
						setTimeout(function(){ 
							const webpage = new ResultsPanel.ResultsPanel(context.extensionUri);
							const nodeServer = new nodeserver.LocalServer(context.extensionUri,webpage.getHtml());
							nodeServer.createServer();
						},300);
						*/

						/*Switching Views!!
						mainDisplay.MainPanel.currentPanel._panel.onDidChangeViewState(e => {
								console.log("Changed!");
								mainDisplay.MainPanel.handleSwitch();
						});
						*/

					}).catch((errorMsg) => {
						//Function not found!
						vscode.window.showWarningMessage('Function not found!');
						console.log("ERROR ON " + errorMsg);
					})
				}, 100);

			}).catch((errorMsg) => {
				//Active Editor Not found
				vscode.window.showWarningMessage('Warning! No Active Editor');
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



/**
 * this method is called when your extension is deactivated
 */
function deactivate() {}




module.exports = {
	// @ts-ignore
	activate,
	deactivate
}