import * as fs from 'fs';
import * as vscode from 'vscode';

export async function generateCreateCommand(caseId: string) {
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
            caseType = await vscode.window.showQuickPick(
                ['E2E', 'UT/IT'], { canPickMany: false }
            );
        } catch (error) {
            vscode.window.showErrorMessage(error);
        }
        if (caseType === 'UT/IT' && projectList) {
            try {
                projectPath = await vscode.window.showQuickPick(
                    projectList, { canPickMany: false }
                );
            } catch (error) {
                vscode.window.showErrorMessage(error);
            }
        }
    }


    const execCommand = caseType === 'E2E' ? `yarn run tees create ${caseId}` : `CASE_TYPE=IT PROJECT_PATH=${projectPath} yarn run tees create ${caseId}`;

    return {execCommand, caseType, rootPath};
}
