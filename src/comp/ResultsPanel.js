/**
 * This is working!
 */

const getNonce = require('./getNonce');


class ResultsPanel {
    constructor(){

    }
    /*
    constructor(extensionUri){
        this._extensionUri = extensionUri;
        this.fspath = extensionUri._fsPath;
        this.path = extensionUri.path;
        this.getPath = extensionUri.fspath;
    }
    */

    getHtml(){
         // The scripts are loaded from the set directory of out/compiled
         // Use a nonce to only allow specific scripts to be run
         const nonce = getNonce.getNonce();
         return `<!DOCTYPE html>
     <html lang="en">
       <head>
       <title>BenchIt</title>
           <meta charset="UTF-8">
           <!--
               Use a content security policy to only allow loading images from https or from our extension directory,
               and only allow scripts that have a specific nonce.
           -->
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
             integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
           <link href="BrowserPage.css" rel="stylesheet">
       </head>
       <body>
         <!-- Svelte Scripts below -->
         <script nonce="${nonce}" id="svelte" src="BrowserPage.js"></script>
         
         <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
         integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous">
         </script>
         <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
             integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous">
         </script>
         <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
             integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous">
         </script>
       </body>
     </html>`;
    }
}

module.exports = {
    // @ts-ignore
    ResultsPanel
  }