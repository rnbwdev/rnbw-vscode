import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const openRnbwDevButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    0
  );
  openRnbwDevButton.text = "🌈";
  openRnbwDevButton.command = "rnbw-vs.openRnbwDev";
  openRnbwDevButton.show();

  const openRnbwDevCommand = vscode.commands.registerCommand(
    "rnbw-vs.openRnbwDev",
    () => {
      vscode.env.openExternal(vscode.Uri.parse("https://rnbw.dev"));
    }
  );
  context.subscriptions.push(openRnbwDevCommand);
}

export function deactivate() {}
