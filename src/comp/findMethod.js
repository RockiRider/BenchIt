/*
	This is where we find the funciton in the active text editor.
	Checks if it exists and then proceeds
	Returns : StartLine, LastLine, FilePath and FunctionText
*/

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