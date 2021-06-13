/**
 * SideBarProvider.js creates the SideBar instance inside VSCode and handles all communication between the extension and the SideBar itself.
 */

const vscode = require('vscode');
const getNonce = require('./getNonce');
const basicMethodStorage = require('./storage/storeBasicMethods');
const dynamicMethodStorage = require('./storage/storeDynamicMethods');
const sidebarDynamicStorage = require('./storage/sideDynamicMethods');
const sidebarBasicStorage = require('./storage/sideBasicMethods');
const {instance} = require('./objController/serverInstance');
const openDefault = require('./browserController/openDefault');

class SidebarProvider {
  constructor(_extensionUri) {
    this._extensionUri = _extensionUri;
  }
  resolveWebviewView(webviewView) {
    this._view = webviewView;
    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      //localResourceRoots: [this._extensionUri],
    };
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    webviewView.webview.onDidReceiveMessage(async (data) => {
      //Recieved from the SideBar
      switch (data.type) {
        case "onMount": {
          if(data.value){
            //Basic
            const currentVal  = sidebarBasicStorage.getStore();
            this._view.webview.postMessage({type: "load-basic-save",value: currentVal});
          }else{
            const currentVal  = sidebarDynamicStorage.getStore();
            this._view.webview.postMessage({type: "load-dynamic-save",value: currentVal});
          }
          
          break;
        }
        case "openBrowser": {
          openDefault.openDefaultBrowser();
          break;
        }
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
        case "onDelete-basic":{
          if(!data.name || !data.id){
            return
          }
          basicMethodStorage.findAndRemove(data.name,data.id);
          //To server
          instance.handleMsg({type: 'onDelete-basic',data:{name:data.name,id:data.id}});
          console.log("Removed");
          break;
        }
        case "onDelete-dynamic":{
          if(!data.name || !data.id){
            return
          }
          dynamicMethodStorage.findAndRemove(data.name,data.id);
          //To server
          instance.handleMsg({type: 'onDelete-dynamic',data:{name:data.name,id:data.id}});
          console.log("Removed");
          break;
        }
      }
    });
  }
  revive(panel) {
    this._view = panel;
  }
  _getHtmlForWebview(webview) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "out", "compiled/MainPanel.js"));
    const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "out", "compiled/MainPanel.css"));
    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce.getNonce();
    return `<!DOCTYPE html>
            <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <!--
                      Use a content security policy to only allow loading images from https or from our extension directory,
                      and only allow scripts that have a specific nonce.
                  -->
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <link href="${styleMainUri}" rel="stylesheet">
                  <script nonce="${nonce}">
                    const jsVscode = acquireVsCodeApi();
                  </script>
              </head>
              <body>
                <!-- Svelte Scripts below -->
                <script nonce="${nonce}" src="${scriptUri}"></script>
              </body>
            </html>`;
  }
}
// @ts-ignore
//exports.getNonce = getNonce;
SidebarProvider._view = undefined;

module.exports = {
  // @ts-ignore
  SidebarProvider
}