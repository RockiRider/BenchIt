

let store = [];

function DynamicSideBarObj(inName,inId){
    this.name = inName;
    this.id = inId;
    this.type = 'Dynamic';
}


/**
 * Returns Array of SideBarObj Objects
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
    store.push(input);
}

/**
 * Finds and removes an Object from the Store 
 * @param {string} nameCheck 
 * @param {Number} idCheck 
 */
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
    DynamicSideBarObj,
    findAndRemove,
    pushToStore
  }

