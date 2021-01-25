import * as vscode from 'vscode';
import { extensionNamespace, teesCreateCase } from '../utils';

export const teesCreateCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.teesCreate`,
  async () => {
    const caseId = await vscode.window.showInputBox({
      placeHolder: 'Please enter case ID or IDs(eg. 1000 or 1000, 1001)',
    })
    if (caseId) {
      await teesCreateCase(caseId);
    }
  },
);
