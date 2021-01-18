const vscode = require('vscode');
const getNonce = require('./getNonce');

class MainPanel {
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._update();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case "alert":
                    vscode.window.showErrorMessage(message.text);
                    return;
            }
        }, null, this._disposables);
    }
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        // If we already have a panel, show it.
        if (MainPanel.currentPanel) {
            MainPanel.currentPanel._panel.reveal(column);
            MainPanel.currentPanel._update();
            return;
        }
        // Otherwise, create a new panel.
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
          <link href="${styleMainUri}" rel="stylesheet">
          <script nonce="${nonce}">
            const jsVscode = acquireVsCodeApi();
          </script>
      </head>
      <body>
      <h1>Working</>
        <!-- Svelte Scripts below -->
        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
    </html>`;
    }
}
MainPanel.viewType = "main-panel";
MainPanel.currentPanel = undefined;


module.exports = {
  // @ts-ignore
  MainPanel
}