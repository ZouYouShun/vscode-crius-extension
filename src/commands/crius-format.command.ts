import * as vscode from 'vscode';

import { extensionNamespace, formatCrius } from '../utils';

export const criusFormatCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.criusFormat`,
  async () => {
    let editor = vscode.window.activeTextEditor;

    if (editor) {
      const { document } = editor;

      const actions = formatCrius(document);

      if (actions.length > 0) {
        editor.edit((editBuilder) => {
          try {
            actions.forEach((a) => editBuilder.replace(...a));
          } catch (error) {
            vscode.window.showErrorMessage(error);
          }
        });
      }
    }
  },
);
