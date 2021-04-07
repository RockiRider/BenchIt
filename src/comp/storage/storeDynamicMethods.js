const side = require('./sideDynamicMethods');
/*
  This is where we store all the Information of the function we are given
  Essentially our database
*/

let store = [];

function DynamicMethodObj(inName, inId, inStart, inFinsih, inPath, inText,inType,inExamples) {
  this.name = inName;
  this.id = inId;
  this.start = inStart;
  this.finish = inFinsih;
  this.fsPath = inPath;
  this.text = inText;
  this.type = inType;
  this.examples = inExamples;

  //We should store colour and results too!
}

/**
 * Returns Array of Method Objects
 */
function getStore(){
  return store;
}

/**
 * Takes an Array and Replaces the Current Store
 * @param {Array} inputArr 
 */
function setStore(inputArr){
  store = inputArr;
}

/**
 * Takes object and pushes it up to the array
 * @param {Object} input 
 */
function pushToStore(input){
  let newSide = new side.DynamicSideBarObj(input.name,input.id);
  side.pushToStore(newSide);
  store.push(input);
}

/**
 * Finds and removes an Object from the Store 
 * @param {string} nameCheck 
 * @param {Number} idCheck 
 */
function findAndRemove(nameCheck,idCheck){
  const result = store.filter(data => data.name !== nameCheck && data.id !== idCheck);
  side.findAndRemove(nameCheck,idCheck);
  setStore(result);
}

/**
 * 
 * @returns boolean false if storage is empty
 */
function storeEmpty(){
  if(store.length > 0) return true;

  return false;
}

function findAndReplace(obj){
  let foundIndex = store.findIndex(el => el.id == obj.id);
  store[foundIndex] = obj;
}


// @ts-ignore
exports.getStore = getStore;

module.exports = {
	// @ts-ignore
  getStore,
  setStore,
  DynamicMethodObj,
  findAndRemove,
  pushToStore,
  storeEmpty,
  findAndReplace,
}