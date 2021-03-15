const vscode = require('vscode');
const getNonce = require('./getNonce');
const methodStorage = require('./storage/storeMethods');
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
      switch (data.type) {
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
        case "onDelete":{
          if(!data.name || !data.id){
            return
          }
          methodStorage.findAndRemove(data.name,data.id);
          //mainDisplay.MainPanel.currentPanel._panel.webview.postMessage({type: 'onDelete',data:{name:data.name,id:data.id}});
          //TODO: On Delete to Server!mainExtension

          //mainExtension.sendServerMsg({type: 'onDelete',data:{name:data.name,id:data.id}});
          instance.handleMsg({type: 'onDelete',data:{name:data.name,id:data.id}});
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