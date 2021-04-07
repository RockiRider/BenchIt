/*
	This is where we find the funciton in the active text editor.
	Checks if it exists and then proceeds
	Returns : StartLine, LastLine, FilePath and FunctionText
*/
const vscode = require('vscode');
const fs = require('fs');
const example = require('./findExamples');



function getMethodData(functionName,activeDoc) {

	if(functionName ===''){
		return {head:"Error",msg:"Function not found"};
	}

	const path = activeDoc.document.uri.fsPath;
	const location = getLocation(functionName,path);

	//let firstLine = activeDoc.document.lineAt(location.start - 1);;
	//let lastLine = activeDoc.document.lineAt(location.finish);

	if(location.header !== "Accepted"){
		return {head:"Error",msg:location.errorMsg}
	}
	//console.log(location);

	let startPos = new vscode.Position(location.start-1,location.firstChar);
	let finishPos = new vscode.Position(location.finish-1,location.lastChar);

	try{
		let textRange = new vscode.Range(startPos,finishPos);
		let methodText = activeDoc.document.getText(textRange);
		const data = {
			head:location.header,
			type:location.exampleData.exampleData.type,
			start:location.start,
			finish:location.finish,
			filePath:path,
			text:methodText,
			msg:location.errorMsg,
			examples:location.exampleData
		};

		return data;
	}catch(e){
		console.log(e);	//Error with finding the functionName
		//Probably a problem with the number of lines in a document
	}
	
	return {head:"Error",msg:"Function not found"};
}

/**
 * Finds the function location on the file & calls example.findComments to find the example based inputs
 */
function getLocation(functionName,path){
	let lines = fs.readFileSync(path, 'utf8').split('\n')
	.filter(Boolean);

	let findings = {
		header: "Failed",
		start: 0,
		finish: 0,
		firstChar: null,
		lastLineCount: null,
		lastChar: null,
		exampleData: null,
		errorMsg:""
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
				startFound = true;
				findings.header = "Accepted";
				if(index !== 0){
					let mainLine = lines[index];
					let params = example.findParams(mainLine);
					if(params){
						let val = example.findComments(lines,functionName,params);
						// @ts-ignore
						if(val.head == 'error'){
							findings.header = "Failed";
							// @ts-ignore
							findings.errorMsg = val.errorMsg;
						}else{
							findings.exampleData = val;
						}
					}else{
						console.log("Defaults to Basic");
						let newData = new example.MethodType("Basic",0,0);
						findings.exampleData = {exampleData:newData};
						//TODO: What if we want a function with 0 params to execute dynamically?
					}
				}else{
					let functionLine = lines[index];
					let params = example.findParams(functionLine);
					if(params){
						findings.header = "Failed";
						findings.errorMsg = "The function has parameters that are not defined with examples";
					}else{
						let newData = new example.MethodType("Basic",0,0);
						findings.exampleData = {exampleData:newData};
					}
					
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



// @ts-ignore
exports.getMethodData = getMethodData;

module.exports = {
	// @ts-ignore
	getMethodData
}