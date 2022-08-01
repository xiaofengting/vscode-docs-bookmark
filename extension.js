const vscode = require("vscode");

const customLinksObject =
  vscode.workspace.getConfiguration().docsBookmark.links;

const getWebviewContent = (uri) => {
  const html = `
    <!DOCTYPE html>
    <html lang="zh">
    <head>
      <style>
        body, html {
          margin: 0; padding: 0; height: 100%; overflow: hidden;
        }
      </style>
    </head>
    <body>
      <iframe width="100%" height="100%" src="${uri}" frameborder="0">
        <p>can't display ${uri}</p>
      </iframe>
    </body>
    </html>`;
  return html;
};

function activate(context) {
  let openDocsBookmark = vscode.commands.registerCommand(
    "docsBookmark.openCommand",
    function () {
      const customMenuItems = Object.getOwnPropertyNames(customLinksObject);
      const menuItems = [...customMenuItems];
      vscode.window.showQuickPick(menuItems).then((selectedMenuItem) => {
        if (selectedMenuItem) {
          const panel = vscode.window.createWebviewPanel(
            "webDocs",
            selectedMenuItem,
            vscode.ViewColumn.One,
            {
              enableScripts: true,
              retainContextWhenHidden: true,
            }
          );
          panel.webview.html = getWebviewContent(
            customLinksObject[selectedMenuItem]
          );
        }
      });
    }
  );
  context.subscriptions.push(openDocsBookmark);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
