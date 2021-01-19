/*
    This tracks if the WebView was closed before the current command was executed.
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