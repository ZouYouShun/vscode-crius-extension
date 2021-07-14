import * as vscode from 'vscode';

import { extensionNamespace, TestCaseGenerator } from '../utils';

export const downloadTestItCaseCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.downloadTestItCase`,
  async () => {
    await new TestCaseGenerator().downloadTestItCase();
  },
);
