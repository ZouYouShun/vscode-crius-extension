import * as vscode from 'vscode';

import {
  criusFormatCommand,
  criusPropsCommand,
  downloadTestItCaseCommand,
} from './commands';
import { formatCrius } from './utils';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(criusPropsCommand);
  context.subscriptions.push(criusFormatCommand);
  context.subscriptions.push(downloadTestItCaseCommand);

  vscode.languages.registerDocumentFormattingEditProvider('typescriptreact', {
    provideDocumentFormattingEdits(document: vscode.TextDocument) {
      const actions = formatCrius(document);

      return actions.map((a) => vscode.TextEdit.replace(...a));
    },
  });
}

export function deactivate() {}
