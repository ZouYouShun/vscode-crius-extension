import { execSync } from 'child_process';
import { OutputChannel } from '../outputCannel';

export function execCreateCommand(rootPath: string, execCommand: string) {
    const result = execSync(`cd ${rootPath}/packages/ringcentral-e2e-test/ && ${execCommand}`);
    OutputChannel.appendLine(result.toString());
}