// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  const disposable = vscode.commands.registerCommand(
    "rnbw-vs.helloRnbw",
    () => {
      const activeTextEditor = vscode.window.activeTextEditor;
      if (activeTextEditor && activeTextEditor.document.languageId === "html") {
        const panel = vscode.window.createWebviewPanel(
          "htmlViewer",
          "HTML Viewer",
          vscode.ViewColumn.One,
          {
            enableScripts: true,
          }
        );

        const document = activeTextEditor.document;
        const htmlContent = document.getText();
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(
          document.uri
        );

        if (workspaceFolder) {
          const htmlFolderPath = path.dirname(document.uri.fsPath);

          const updatedHtmlContent = htmlContent.replace(
            /(href|src)=["']([^"']+)["']/g,
            (match, attribute, filePath) => {
              if (isRemoteUrl(filePath)) {
                return match; // Return the original URL if it's a remote URL
              } else {
                const resourceUri = vscode.Uri.file(
                  path.resolve(htmlFolderPath, filePath)
                );
                const webviewUri = panel.webview.asWebviewUri(resourceUri);
                return `${attribute}="${webviewUri}"`;
              }
            }
          );

          panel.webview.html = getWebviewContent(updatedHtmlContent);
        }
      } else {
        vscode.window.showInformationMessage(
          "No HTML file is currently open in the editor."
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

function isRemoteUrl(url: string) {
  try {
    const urlObject = new URL(url);
    return urlObject.protocol === "http:" || urlObject.protocol === "https:";
  } catch (error) {
    return false;
  }
}
function getWebviewContent(htmlContent: string) {
  console.log(htmlContent);
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
        }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;
}
// This method is called when your extension is deactivated
export function deactivate() {}
