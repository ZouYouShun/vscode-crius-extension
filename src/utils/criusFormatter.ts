import * as ts from 'typescript';
import * as vscode from 'vscode';

import { RangeReplace } from './formatCrius';
import { getFormatTemplate } from './getFormatTemplate';

const testTypes = ['ut', 'it', 'e2e', 'manual'];
const priorities = ['p0', 'p1', 'p2', 'p3'];

const criusSortArr = [
  'autorun',
  ...testTypes,
  ...priorities,
  'skip',
  'status',
  'title',
];

type FindAndFormatParams = {
  text: string;
  spaceNumber?: number;
  startText: string;
};
export class CriusFormatter {
  actions: RangeReplace[] = [];

  constructor(private document: vscode.TextDocument) {}

  runThoughAllText(
    fn: (remainTemplate: string) => [RangeReplace | null, string],
  ) {
    let remainTemplate = this.document.getText();

    while (remainTemplate) {
      const [action, remain] = fn(remainTemplate);

      if (action) {
        this.actions.push(action);
      }

      remainTemplate = remain;
    }
    return this.actions;
  }

  formatExample({
    text,
    spaceNumber,
    startText,
  }: FindAndFormatParams): [RangeReplace | null, string] {
    const start = text.lastIndexOf(startText);

    const end = start + text.slice(start).indexOf('`)');

    if (start === -1) {
      return [null, ''];
    }

    const template = text.substring(start + startText.length, end);

    const resultTemplate = getFormatTemplate(template, spaceNumber);

    return [
      [
        new vscode.Range(
          this.document.positionAt(start + startText.length),
          this.document.positionAt(end),
        ),
        resultTemplate,
      ],
      text.slice(0, start),
    ];
  }

  formatDecorator(): RangeReplace[] {
    const template = this.document.getText();

    const sourceFile = ts.createSourceFile(
      this.document.uri.toString(),
      this.document.getText(),
      ts.ScriptTarget.Latest,
    );

    ts.forEachChild(sourceFile, (node) => {
      const { decorators } = node;
      if (decorators && decorators.length > 0) {
        const decoratorList = decorators.map((decorator, i) => {
          // -1 for get '@'
          let start = decorator.expression.getFullStart() - 1;
          let end = decorator.expression.getEnd();

          const leadingComments = ts.getLeadingCommentRanges(
            template,
            // -1 for previous line
            end,
          );

          if (leadingComments?.length && i !== decorators.length - 1) {
            // add comment to next line
            (decorators[i + 1] as any).comment = leadingComments[0];
          }

          const comment: ts.CommentRange = (decorator as any).comment;

          if (comment) {
            start = comment.pos;
          }

          const trailingComments = ts.getTrailingCommentRanges(template, end);
          if (trailingComments?.length) {
            end = trailingComments[0].end;
          }

          const text = template.substring(start, end);
          const escapedText =
            (decorator.expression as any).escapedText ||
            (decorator.expression as any).expression.escapedText;
          return {
            start,
            end,
            text,
            escapedText,
            sort: criusSortArr.findIndex((c) => escapedText === c),
            comment: (decorator as any).comment,
          };
        });
        const start = decoratorList[0].start;
        const end = decoratorList[decoratorList.length - 1].end;

        const resultTemplate = decoratorList
          .sort((a, b) => {
            return a.sort - b.sort;
          })
          .map((x) => x.text)
          .join('\n');

        this.actions.push([
          new vscode.Range(
            this.document.positionAt(start),
            this.document.positionAt(end),
          ),
          resultTemplate,
        ]);
      }
    });

    return this.actions;
  }
}
