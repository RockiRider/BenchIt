const open = require('open');
const vscode = require('vscode');

const port = 52999;

function openDefaultBrowser () {
    open(`http://localhost:${port}`).catch((error)=>{
        console.log(error);
        console.log("Could not open Browser!");
        vscode.window.showWarningMessage('Error! Could not open Browser!');
    });
}


module.exports = {
	// @ts-ignore
    openDefaultBrowser,
}