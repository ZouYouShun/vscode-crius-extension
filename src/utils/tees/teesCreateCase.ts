import { exec } from 'child_process';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { OutputChannel } from '..';

export class TestCaseGenerator {
    static async teesCreateCase() {
    const caseId = await vscode.window.showInputBox({
      placeHolder: 'Please enter case ID or IDs(eg. 1000 or 1000, 1001)',
    });

    let caseType: string | undefined, projectPath: string | undefined;
    let projectList: string[];
    const { rootPath } = vscode.workspace;
    if (rootPath) {
      const _dir = `${rootPath}/packages/`;
      if (fs.existsSync(_dir)) {
        projectList = fs.readdirSync(_dir);
      }
    }

    if (!isNaN(Number(caseId))) {
      caseType = await vscode.window.showQuickPick(['E2E', 'UT/IT'], {
        canPickMany: false,
      });
      if (caseType === 'UT/IT' && projectList) {
        projectPath = await vscode.window.showQuickPick(projectList, {
          canPickMany: false,
        });
      }
    } else {
      vscode.window.showErrorMessage('Please enter an case ID like: 1000');
    }

    const prefixCommand =
      caseType === 'E2E' ? '' : `CASE_TYPE=IT PROJECT_PATH=${projectPath}`;
    const execCommand = `${prefixCommand} yarn run tees create ${caseId}`;

    vscode.window.withProgress(
      {
        cancellable: false,
        location: vscode.ProgressLocation.Notification,
        title: `Creating ${caseType} case RCI-${caseId} ......`,
      },
      async () => {
        const result = await new Promise<string>((resolve) => {
          exec(
            `cd ${rootPath}/packages/ringcentral-e2e-test/ && ${execCommand}`,
            (error, stdout) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return;
              }
              resolve(stdout);
            },
          );
        });
        OutputChannel.appendLine(result);
      },
    );
  }
}
