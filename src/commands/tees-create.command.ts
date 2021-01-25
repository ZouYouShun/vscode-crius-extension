import * as vscode from 'vscode';
import { extensionNamespace, teesCreateCase } from '../utils';

export const teesCreateCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.teesCreate`,
  async () => {
    await teesCreateCase();
  },
);
