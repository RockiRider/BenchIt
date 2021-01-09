const vscode = require('vscode');


function getInput(name) {
  vscode.window.showInformationMessage('Hello World from BenchMe & '+name);
}
// @ts-ignore
exports.getInput = getInput;

module.exports = {
	// @ts-ignore
	getInput
}