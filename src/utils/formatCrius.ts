import * as vscode from 'vscode';

import { extensionNamespace } from './';
import { CriusFormatter } from './criusFormatter';

export type RangeReplace = [vscode.Range, string];

export function formatCrius(document: vscode.TextDocument) {
  const spaceNumber = vscode.workspace
    .getConfiguration(extensionNamespace)
    .get<number>('spaceNumber');

  const formatter = new CriusFormatter(document);

  formatter.runThoughAllText((text) =>
    formatter.formatExample({
      text,
      spaceNumber,
      startText: '@examples(`',
    }),
  );

  formatter.runThoughAllText((text) =>
    formatter.formatExample({
      text,
      spaceNumber,
      startText: '@(examples`',
    }),
  );

  formatter.formatDecorator();

  return formatter.actions;
}
