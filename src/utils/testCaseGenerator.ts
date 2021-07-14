import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import { OutputChannel } from './extension';

export class TestCaseGenerator {
  private caseId: string;
  private caseType: string;
  private projectPath: string;
  private projectList = new Set<string>();
  private targetPath: string;

  constructor() {
    // TODO: get config from setting
  }

  async getQuestionResult() {
    const { workspaceFolders } = vscode.workspace;
    let rootPath = workspaceFolders[0].uri.path;

    if (workspaceFolders.length > 1) {
      rootPath = await vscode.window.showQuickPick(
        workspaceFolders.map((w) => w.uri.path),
        {
          canPickMany: false,
        },
      );

      if (!rootPath) {
        throw new Error('no rootPath');
      }
    }

    if (rootPath) {
      const packagesPath = `${rootPath}/packages`;
      if (fs.existsSync(packagesPath)) {
        this.projectList = new Set(
          fs
            .readdirSync(packagesPath)
            .filter((x) => x !== '.DS_Store'),
        );
      }

      this.targetPath = `${rootPath}/packages/ringcentral-e2e-test`;
    }

    this.caseId = await vscode.window.showInputBox({
      placeHolder: 'Please enter case ID or IDs(eg. 1000 or 1000, 1001)',
    });

    if (this.caseId === '') {
      throw new Error('no caseId');
    }

    if (isNaN(Number(this.caseId))) {
      throw new Error('error caseId');
    }

    this.caseType = await vscode.window.showQuickPick(['E2E', 'UT/IT'], {
      canPickMany: false,
    });

    if (!this.caseType) {
      throw new Error('no caseType');
    }

    if (this.caseType === 'UT/IT') {
      this.projectPath = await vscode.window.showQuickPick(
        [...this.projectList],
        {
          canPickMany: false,
        },
      );

      if (!this.projectPath) {
        throw new Error('no projectPath');
      }
    }
  }

  async downloadTestItCase() {
    try {
      await this.getQuestionResult();

      const prevCommand =
        this.caseType === 'E2E'
          ? ''
          : `CASE_TYPE=IT PROJECT_PATH=${this.projectPath} `;

      const execCommand = `cd ${this.targetPath} && ${prevCommand}yarn run tees create ${this.caseId}`;

      const result = await vscode.window.withProgress<string>(
        {
          cancellable: true,
          location: vscode.ProgressLocation.Notification,
          title: `Creating ${this.caseType} case RCI-${this.caseId} ......`,
        },
        (process, token) => {
          return new Promise<string>((resolve, reject) => {
            const runCommand = exec(execCommand, (error, stdout) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return;
              }

              resolve(stdout);
              return;
            });

            token.onCancellationRequested(() => {
              runCommand.kill();
              reject('cancel');
              return;
            });
          });
        },
      );

      OutputChannel.appendLine(result);
    } catch (error) {
      switch (error.message) {
        case 'error caseId':
          vscode.window.showErrorMessage('Please enter an case ID like: 1000');
          break;

        default:
          break;
      }
    }
  }
}
