import * as vscode from 'vscode';
import { extensionNamespace, generateCreateCommand, execCreateCommand } from '../utils';

export const teesCreateCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.teesCreate`,
  async () => {
    const caseId = await vscode.window.showInputBox({
      placeHolder: 'Please enter case ID or IDs(eg. 1000 or 1000, 1001)',
    })
    if (caseId) {
      const { execCommand, caseType, rootPath } = await generateCreateCommand(caseId);
      await vscode.window.showInformationMessage(`Creating ${caseType} case RCI-${caseId}......`);

      execCreateCommand(rootPath, execCommand);
    }
  },
);
