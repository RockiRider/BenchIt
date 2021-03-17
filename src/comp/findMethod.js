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

	//let firstLine = activeDoc.document.lineAt(location.start - 1);;
	//let lastLine = activeDoc.document.lineAt(location.finish);
	let startPos = new vscode.Position(location.start-1,location.firstChar);
	let finishPos = new vscode.Position(location.finish-1,location.lastChar);

	try{
		let textRange = new vscode.Range(startPos,finishPos);
		let methodText = activeDoc.document.getText(textRange);
		const data = {start:location.start,finish:location.finish,filePath:path,text:methodText};

		return data;
	}catch(e){
		console.log(e);	//Error with finding the functionName
		//Probably a problem with the number of lines in a document
	}
	
	return 'Error';
}

//TODO: ES6 + ES5

function MethodType(inType,inParams,inNumOfParams){
	this.type = inType;
	this.params = inParams;
	this.numOfParams = inNumOfParams;
}

function getLocation(functionName,path){
	let lines = fs.readFileSync(path, 'utf8').split('\n')
	.filter(Boolean);

	let findings = {
		start: 0,
		finish: 0,
		firstChar: null,
		lastLineCount: null,
		lastChar: null,
		exampleData: null,
	};
	let openCounter = 0;
	let closeCounter = 0;
	let startFound = false;
	let endFound = false;



	for (let index = 0; index < lines.length; index++) {
		if (findings.finish != 0 &&  findings.start != 0) {
			//Whole Method is found so we break
			break;
		}else{
			if (lines[index].includes("function " + functionName)) {
				//Function name is found so we mark the index/lineNumber
				findings.start = index +1;
				findings.firstChar = nthIndex(lines[index],"function",1)
				console.log(findings.firstChar);
				startFound = true;

				if(index !== 1){
					for(let i = index;i>0;i--){

					}
				}else{

				}
				
			}
			if (startFound &&  openCounter > 0 && lines[index].includes("}")) {
				let count = lines[index].split('').filter(x => x == '}').length;
				closeCounter += count;
				if(closeCounter == openCounter){
					findings.finish = index + 1;
					findings.lastLineCount = count;
					findings.lastChar = nthIndex(lines[index],"}",count)+1;
					endFound = true;
				}
			}
			if(startFound && !endFound && lines[index].includes("{")){
				let count = lines[index].split('').filter(x => x == '{').length;
				openCounter += count;
			}
			
		}
		
	}
	return findings;
}

/**
 * 
 * @returns The nth position of pattern within str
 */
function nthIndex(str, pattern, n){
    var length= str.length, i= -1;
    while(n-- && i++<length){
        i= str.indexOf(pattern, i);
        if (i < 0) break;
    }
    return i;
}

/**
 * Look for comments above the function.
 * Search for the Example-Based inputs!
 */
function findComments(str){

}

// @ts-ignore
exports.getMethodData = getMethodData;

module.exports = {
	// @ts-ignore
	getMethodData
}