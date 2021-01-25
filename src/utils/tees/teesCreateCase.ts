import { exec } from 'child_process';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { OutputChannel } from '..';

export async function teesCreateCase(caseId: string) {
    let caseType, projectPath;
    let projectList;
    const { rootPath } = vscode.workspace;
    if (rootPath) {
        fs.readdir(`${rootPath}/packages/`, (err, files) => {
            projectList = files;
        });
    }
    if (caseId) {
        try {
            caseType = await vscode.window.showQuickPick(['E2E', 'UT/IT'], {
                canPickMany: false,
            });
        } catch (error) {
            vscode.window.showErrorMessage(error);
        }
        if (caseType === 'UT/IT' && projectList) {
            try {
                projectPath = await vscode.window.showQuickPick(projectList, {
                    canPickMany: false,
                });
            } catch (error) {
                vscode.window.showErrorMessage(error);
            }
        }
    }

    const execCommand =
        caseType === 'E2E'
            ? `yarn run tees create ${caseId}`
            : `CASE_TYPE=IT PROJECT_PATH=${projectPath} yarn run tees create ${caseId}`;

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
        });
}
