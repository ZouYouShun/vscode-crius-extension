import * as vscode from 'vscode';
import { extensionNamespace, TestCaseGenerator } from '../utils';

export const teesCreateCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.teesCreate`,
  async () => {
    await TestCaseGenerator.teesCreateCase();
  },
);
