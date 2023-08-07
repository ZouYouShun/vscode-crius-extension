import * as vscode from 'vscode';

import { extensionNamespace, TestCaseGenerator } from '../utils';

export const downloadTestItCaseCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.downloadTestItCase`,
  async () => {
    const includeProjects = vscode.workspace
      .getConfiguration(extensionNamespace)
      .get<string[]>('includeProjects');

    await new TestCaseGenerator({ includeProjects }).downloadTestItCase();
  },
);
