import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function getWorkspaceFolder(): Promise<vscode.WorkspaceFolder | undefined> {
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length === 1) {
        return vscode.workspace.workspaceFolders[0];
    }

    return await vscode.window.showWorkspaceFolderPick();
}

export function getConfig() {
    const config = vscode.workspace.getConfiguration('chatgptAppend');
    const maxFileSize = config.get<number>('maxFileSize') || 2000;
    const folderName = config.get<string>('folderName') || `chatgpt_append_files`;
    const ignoreFiles = config.get<string[]>('ignoreFiles') || [];

    return { maxFileSize, folderName, ignoreFiles };
}

export function createOutputFolder(folder: vscode.WorkspaceFolder, folderName: string) {
    const newFolderPath = path.join(folder.uri.fsPath, folderName);
    if (!fs.existsSync(newFolderPath)) {
        fs.mkdirSync(newFolderPath);
    }

    return newFolderPath;
}
