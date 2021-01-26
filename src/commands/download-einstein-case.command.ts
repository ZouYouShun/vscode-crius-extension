import * as vscode from 'vscode';

import { extensionNamespace, TestCaseGenerator } from '../utils';

export const downloadEinsteinCaseCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.downloadEinsteinCase`,
  async () => {
    await new TestCaseGenerator().downloadEinsteinCase();
  },
);
