import * as vscode from "vscode";

import {
  extensionNamespace,
} from "./utils";
import { getFormatTemplate } from "./utils/getFormatTemplate";

const startString = "@examples(`";
const endString = "`)";

export const space = " ";

export function activate(context: vscode.ExtensionContext) {
  vscode.languages.registerDocumentFormattingEditProvider("typescriptreact", {
    provideDocumentFormattingEdits(document: vscode.TextDocument) {
      const text = document.getText();

      const spaceNumber = vscode.workspace
        .getConfiguration(extensionNamespace)
        .get<number>("spaceNumber");

      let actions: vscode.TextEdit[] = [];

      let remainTemplate = text;

      while (remainTemplate) {
        const [action, remain] = findAndFormat(
          remainTemplate,
          spaceNumber,
          document
        );

        if (action) {
          actions = [...actions, action];
        }

        remainTemplate = remain;
      }

      return actions;
    },
  });

  function findAndFormat(
    text: string,
    spaceNumber: number | undefined,
    document: vscode.TextDocument
  ): [vscode.TextEdit | null, string] {
    const start = text.lastIndexOf(startString);

    const end = start + text.slice(start).indexOf(endString);

    if (start === -1) {
      return [null, ""];
    }

    const template = text.substring(start + startString.length, end);

    const resultTemplate = getFormatTemplate(template, spaceNumber);

    return [
      vscode.TextEdit.replace(
        new vscode.Range(
          document.positionAt(start + startString.length),
          document.positionAt(end)
        ),
        resultTemplate
      ),
      text.slice(0, start),
    ];
  }
}

export function deactivate() {}


