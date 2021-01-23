/*
	This is where we find the funciton in the active text editor.
	Checks if it exists and then proceeds
	Returns : StartLine, LastLine, FilePath and FunctionText
*/
const vscode = require('vscode');
const fs = require('fs');



function getMethodData(functionName,activeDoc) {

	if(functionName ===''){
		return 'Error';
	}

	const path = activeDoc.document.uri.fsPath;
	const location = getLocation(functionName,path);

	let firstLine = activeDoc.document.lineAt(location.start - 1);;
	let lastLine = activeDoc.document.lineAt(location.finish);

	try{
		var textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
		let methodText = activeDoc.document.getText(textRange);
		const data = {start:location.start,finish:location.finish,filePath:path,text:methodText};

		return data;
	}catch(e){
		console.log(e);	//Error with finding the functionName
		//Probably a problem with the number of lines in a document
	}
	
	return 'Error';
}

function getLocation(functionName,path){
	let lines = fs.readFileSync(path, 'utf8').split('\n')
	.filter(Boolean);

	let findings = {
		start: 0,
		finish: 0
	};

	let startFound = false;
	for (let index = 0; index < lines.length; index++) {
		if (findings.start != 0 && findings.finish != 0) {
			//Whole Method is found so we break
			break;
		} else if (lines[index].includes("function " + functionName)) {
			//Function name is found so we mark the index/lineNumber
			findings.start = index + 1;
			startFound = true;
		} else if (lines[index].includes("}") && startFound) {
			findings.finish = index + 1;
		}
	}
	return findings;
}


// @ts-ignore
exports.getMethodData = getMethodData;

module.exports = {
	// @ts-ignore
	getMethodData
}