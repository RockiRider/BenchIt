/*
  This is where we store all the Information of the function we are given
  Essentially our database
*/

let store = [];

function MethodObj(inName, inId, inStart, inFinsih, inPath, inText) {
  this.name = inName;
  this.id = inId;
  this.start = inStart;
  this.finish = inFinsih;
  this.fsPath = inPath;
  this.text = inText;
}

function getStore(){
  return store;
}

function setStore(inputArr){
  store = inputArr;
}

function pushToStore(input){
  store.push(input);
}

function findAndRemove(nameCheck,idCheck){
  const result = store.filter(data => data.name !== nameCheck && data.id !== idCheck);
  setStore(result);
}


// @ts-ignore
exports.getStore = getStore;

module.exports = {
	// @ts-ignore
  getStore,
  setStore,
  MethodObj,
  findAndRemove,
  pushToStore
}