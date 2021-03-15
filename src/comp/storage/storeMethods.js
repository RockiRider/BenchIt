const side = require('./sideMethods');
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
  const newSide = side.SideBarObj(input.name,input.id);
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