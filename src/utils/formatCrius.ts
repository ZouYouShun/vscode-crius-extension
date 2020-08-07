import * as vscode from 'vscode';

import { extensionNamespace } from './';
import { getFormatTemplate } from './getFormatTemplate';

export const startString = '@examples(`';
export const startString2 = '@(examples`';
export const endString = '`)';

type RangeReplace = [vscode.Range, string];

export function formatCrius(document: vscode.TextDocument) {
  const spaceNumber = vscode.workspace
    .getConfiguration(extensionNamespace)
    .get<number>('spaceNumber');

  let actions: RangeReplace[] = [];

  function format(startText: string) {
    let remainTemplate = document.getText();
    while (remainTemplate) {
      const [action, remain] = findAndFormat({
        text: remainTemplate,
        spaceNumber,
        document,
        startText,
      });

      if (action) {
        actions = [...actions, action];
      }

      remainTemplate = remain;
    }
  }

  format(startString);
  format(startString2);

  return actions;
}

type FindAndFormatParams = {
  text: string;
  spaceNumber: number | undefined;
  document: vscode.TextDocument;
  startText: string;
};

function findAndFormat({
  text,
  spaceNumber,
  document,
  startText,
}: FindAndFormatParams): [RangeReplace | null, string] {
  const start = text.lastIndexOf(startText);

  const end = start + text.slice(start).indexOf(endString);

  if (start === -1) {
    return [null, ''];
  }

  const template = text.substring(start + startString.length, end);

  const resultTemplate = getFormatTemplate(template, spaceNumber);

  return [
    [
      new vscode.Range(
        document.positionAt(start + startString.length),
        document.positionAt(end),
      ),
      resultTemplate,
    ],
    text.slice(0, start),
  ];
}
