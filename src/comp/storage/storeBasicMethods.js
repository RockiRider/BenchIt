const side = require('./sideBasicMethods');
/*
  This is where we store all the Information of the function we are given
  Essentially our database
*/

let store = [];

/**
 * 
 * @param {String} inName Name of the Function
 * @param {Number} inId Id of the Dynamic Function which should be unique
 * @param {Number} inStart Where the function Starts in the file
 * @param {Number} inFinsih here the function ends in the file
 * @param {String} inPath The files path
 * @param {String} inText The text of the function
 * @param {String} inType The Type of function Dynamic | Basic
 * @param {Object} inExamples The example based inputs for any possible parameters
 */
function BasicMethodObj(inName, inId, inStart, inFinsih, inPath, inText,inType,inExamples) {
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
  let newSide = new side.BasicSideBarObj(input.name,input.id);
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
  BasicMethodObj,
  findAndRemove,
  pushToStore,
  storeEmpty,
  findAndReplace,
}