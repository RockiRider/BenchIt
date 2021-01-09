const vsCodeFunction = Function(`
  // forgive me for my sins
  if (typeof acquireVsCodeApi == 'function') {
    return acquireVsCodeApi();
  } else {
    return undefined;
  }
`);

let completeImport = "something";

const importer = (inhere) =>{
  completeImport = inhere;
}



(function(){
  const vscode = vsCodeFunction();
  // Do stuff with api like getting the state
  vscode.getState();
  
  // Do stuff with api like getting the state
  vscode.getState();
  console.log("hello!!!");
  // @ts-ignore
  const counter = document.getElementById('button');
  counter.innerText = "Hello from JS!"


  $(document).ready(function() {
      console.log( "ready!" );
      hello(completeImport);
  });
})();


function hello (something){
  console.log("wtf"+something );
}

// @ts-ignore
exports.importer = importer;

module.exports = {
	// @ts-ignore
	importer
}