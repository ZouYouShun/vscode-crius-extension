import * as vscode from 'vscode';

import { endString, startString } from '../extension';
import { extensionNamespace } from './';
import { getFormatTemplate } from './getFormatTemplate';

type RangeReplace = [vscode.Range, string];

export function formatCrius(document: vscode.TextDocument) {
  const text = document.getText();

  const spaceNumber = vscode.workspace
    .getConfiguration(extensionNamespace)
    .get<number>('spaceNumber');

  let actions: RangeReplace[] = [];

  let remainTemplate = text;

  while (remainTemplate) {
    const [action, remain] = findAndFormat(
      remainTemplate,
      spaceNumber,
      document,
    );

    if (action) {
      actions = [...actions, action];
    }

    remainTemplate = remain;
  }

  return actions;
}


function findAndFormat(
  text: string,
  spaceNumber: number | undefined,
  document: vscode.TextDocument,
): [RangeReplace | null, string] {
  const start = text.lastIndexOf(startString);

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
