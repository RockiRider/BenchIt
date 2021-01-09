const vscode = require('vscode');



function getInput(functionName) {
  vscode.window.showInformationMessage('Function Name is '+ functionName);
  
}
// @ts-ignore
exports.getInput = getInput;

module.exports = {
	// @ts-ignore
	getInput
}