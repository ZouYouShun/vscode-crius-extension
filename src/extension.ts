// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import { parserString } from "./parserString";
import { extensionNamespace } from "./utils";

const startString = "@examples(`";
const endString = "`)";

const space = " ";

export function activate(context: vscode.ExtensionContext) {
  vscode.languages.registerDocumentFormattingEditProvider("typescriptreact", {
    provideDocumentFormattingEdits(document: vscode.TextDocument) {
      const text = document.getText();

      const spaceNumber = vscode.workspace
        .getConfiguration(extensionNamespace)
        .get<number>("spaceNumber");

      const start = text.indexOf(startString);

      const end = start + text.slice(start).indexOf(endString);

      const template = text.substring(start + startString.length, end);

      const resultTemplate = formatTemplate(template, spaceNumber);

      return [
        vscode.TextEdit.replace(
          new vscode.Range(
            document.positionAt(start + startString.length),
            document.positionAt(end)
          ),
          resultTemplate
        ),
      ];
    },
  });

  function formatTemplate(template: string, spaceNumber: number = 4) {
    const [obj, keyArr] = parserString(template);

    const additionLength = 4 + 3 * (keyArr.length - 1);

    let maxLengthIndex = 0;

    const maxLength = obj.reduce<number>((prev, curr, i) => {
      const length = getObjectStringLength(Object.values(curr));

      if (prev < length) {
        maxLengthIndex = i;
        return length;
      }
      return prev;
    }, getObjectStringLength(keyArr));

    const templateArr: string[][] = [];

    for (let i = 0; i < obj.length + 1; i++) {
      templateArr.push([]);

      for (let j = 0; j < maxLength + additionLength; j++) {
        templateArr[i].push(" ");
      }
    }

    const breakPosition = getBreakPosition(obj, maxLengthIndex, keyArr);

    keyArr.forEach((key, index) => {
      for (let i = 0; i < key.length; i++) {
        const char = key[i];
        templateArr[0][breakPosition[index] + 2 + i] = char;
      }

      obj.forEach((o, objIndex) => {
        const val = o[key];

        for (let i = 0; i < val.length; i++) {
          const char = val[i];
          templateArr[1 + objIndex][breakPosition[index] + 2 + i] = char;
        }
      });
    });

    templateArr.forEach((t) => {
      breakPosition.forEach((position) => {
        t[position] = "|";
      });
    });

    const resultTemplate =
      templateArr.reduce((prev, curr) => {
        prev += space.repeat(spaceNumber) + curr.join("") + "\r\n";
        return prev;
      }, "\r\n") + space.repeat(spaceNumber / 2);

    return resultTemplate;
  }

  function getBreakPosition(
    obj: { [K: string]: string }[],
    maxLengthIndex: number,
    keyArr: string[]
  ) {
    const breakPosition = [];
    const maxObj = obj[maxLengthIndex];
    let currentCursorPosition = 0;
    breakPosition.push(0);
    currentCursorPosition += 2;

    keyArr.forEach((x) => {
      currentCursorPosition += maxObj[x].length + 1;
      breakPosition.push(currentCursorPosition);
      currentCursorPosition += 2;
    });
    return breakPosition;
  }

  function getObjectStringLength(curr: string[]) {
    return curr.reduce((total, currentValue) => {
      return total + currentValue.length;
    }, 0);
  }
}

export function deactivate() {}
