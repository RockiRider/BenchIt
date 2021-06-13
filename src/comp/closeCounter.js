/** 
* This tracks if the WebView was closed before the current command was executed.
* Not being used anymore.
*/
let justClosed = false;

function setClose(input) {
    justClosed = input;
}
function getClose(){
    return justClosed;
}
module.exports = {
    // @ts-ignore
    setClose,
    getClose
  }