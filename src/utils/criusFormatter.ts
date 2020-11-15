import * as vscode from 'vscode';
import { getFormatTemplate } from './getFormatTemplate';
import { RangeReplace } from './formatCrius';

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
        this.actions = [...this.actions, action];
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

  formatDecorator({
    text,
    startText,
    endText,
  }: FindAndFormatParams & {
    endText: string;
  }): [RangeReplace | null, string] {
    const start = text.lastIndexOf(startText);

    const end = start + text.slice(start).indexOf(endText);

    if (start === -1) {
      return [null, ''];
    }

    const template = text.substring(start, end);

    const t = template.split(/^@|\n/gm);

    const resultTemplate = t
      .filter((tag) => !!tag)
      .map((tag) => ({
        tag,
        sort: criusSortArr.findIndex(
          (c) => tag.replace(/\r?\n|\r|\s/g, '').split('(')[0] === c,
        ),
      }))
      .sort((a, b) => {
        return a.sort - b.sort;
      });

    return [
      [
        new vscode.Range(
          this.document.positionAt(start),
          this.document.positionAt(end),
        ),
        '\n\n' +
          resultTemplate
            .map((x) => `${x.tag.includes('//') ? '' : '@'}${x.tag}`)
            .join('\n') +
          '\n',
      ],
      text.slice(0, start),
    ];
  }
}
