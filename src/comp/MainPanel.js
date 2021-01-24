const vscode = require('vscode');
const getNonce = require('./getNonce');
const closeViewTracker = require('./closeCounter');
//const sidebar = require('./SideBarProvider');


class MainPanel {
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._update();
        this._panel.onDidDispose(() => {
            console.log("Closed!!");
            closeViewTracker.setClose(true);
            this.dispose(), null, this._disposables
        });
        // Handle messages from the webview
    }
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        // If we already have a panel, show it.
        if (MainPanel.currentPanel) {
            MainPanel.currentPanel._panel.reveal(column);
            //MainPanel.currentPanel._update();
            MainPanel.lastPanel = MainPanel.currentPanel; //Save Panel
            return;
        }
        // Otherwise, create a new panel.
        console.log("Creating New Panel!");
        const panel = vscode.window.createWebviewPanel(MainPanel.viewType, "BenchMe", column || vscode.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,
            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [
                vscode.Uri.joinPath(extensionUri, "media"),
                vscode.Uri.joinPath(extensionUri, "out/compiled"),
            ],
        });
        MainPanel.currentPanel = new MainPanel(panel, extensionUri);
        
    }
    static kill() {
        var _a;
        (_a = MainPanel.currentPanel) === null || _a === void 0 ? void 0 : _a.dispose();
        MainPanel.currentPanel = undefined;
    }
    static handleSwitch(){
        MainPanel.currentPanel._update();
    }
    static revive(panel, extensionUri) {
        MainPanel.currentPanel = new MainPanel(panel, extensionUri);
    }

    dispose() {
        MainPanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    async _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
        webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case "firstSync": {
                    if (!data.value) {
                        return;
                    }
                    //sidebar.SidebarProvider.
                    /*
                    var _a;
					(_a = sidebar.SidebarProvider._view) === null || _a === void 0 ? void 0 : _a.webview.postMessage({
						type: "new-function",
						value: {
							name: data.value.name,
							id: data.value.id
						},
                    })
                    */
                    console.log("Sync HERE!");
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
            }
        });
    }
    _getHtmlForWebview(webview) {
        // // And the uri we use to load this script in the webview
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "out", "compiled/WebPanel.js"));
        // Local path to css styles
        //const styleResetPath = vscode.Uri.joinPath(this._extensionUri, "media", "reset.css");
        //const stylesPathMainPath = vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css");
        // Uri to load styles into webview
        //const styleResetUri = webview.asWebviewUri(styleResetPath);
        //const styleVSCodeUri = webview.asWebviewUri(stylesPathMainPath);
        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "out", "compiled/WebPanel.css"));
        // Use a nonce to only allow specific scripts to be run
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
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
			integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
          <link href="${styleMainUri}" rel="stylesheet">
          <script nonce="${nonce}">
            const jsVscode = acquireVsCodeApi();
          </script>
      </head>
      <body>
        <!-- Svelte Scripts below -->
        <script nonce="${nonce}" src="${scriptUri}"></script>
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

MainPanel._panel = undefined;
MainPanel.viewType = "main-panel";
MainPanel.currentPanel = undefined;
MainPanel.lastPanel = undefined;


module.exports = {
  // @ts-ignore
  MainPanel
}