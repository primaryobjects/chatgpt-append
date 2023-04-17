import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('chatgpt-append.build', async () => {
        const folder = await getWorkspaceFolder();
        if (!folder) {
            return;
        }

        const fileTypes = ['txt', 'py', 'js', 'css', 'cs', 'java', 'cpp', 'c', 'go', 'rb', 'php', 'swift', 'kt',
            'rs', 'sh', 'pl', 'm', 'f90', 'r', 'jl', 'lua', 'tcl', 'hs', 'ml', 'scm', 'clj', 'erl', 'lisp', 'scala',
			'html', 'htm'];
        const exclude = '**/node_modules/**';
        const files = await vscode.workspace.findFiles(`**/*.{${fileTypes.join(',')}}`, exclude);
        let content = '';

        for (const file of files) {
            const fileName = path.basename(file.fsPath);
            const fileContent = fs.readFileSync(file.fsPath).toString();
            content += `--- FILENAME: ${fileName}\n${fileContent}\n`;
        }

		/*
		settings.json
		"chatgptAppend.maxFileSize": 2000,
		"chatgptAppend.folderName": "chatgpt_append_files"
		*/
        const config = vscode.workspace.getConfiguration('chatgptAppend');
        const maxFileSize = config.get<number>('maxFileSize') || 2000;
        const folderName = config.get<string>('folderName') || `chatgpt_append_files`;

        let fileIndex = 1;
        const newFolderPath = path.join(folder.uri.fsPath, folderName);
        if (!fs.existsSync(newFolderPath)) {
            fs.mkdirSync(newFolderPath);
        }
        while (content.length > 0) {
            const newFilePath = path.join(newFolderPath, `part_${fileIndex}.txt`);
            fs.writeFileSync(newFilePath, content.slice(0, maxFileSize));
            content = content.slice(maxFileSize);
            fileIndex++;
        }

        vscode.window.showInformationMessage(`ChatGPT files created successfully in folder ${newFolderPath}`);
    });

    context.subscriptions.push(disposable);
}

async function getWorkspaceFolder(): Promise<vscode.WorkspaceFolder | undefined> {
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length === 1) {
        return vscode.workspace.workspaceFolders[0];
    }

    return await vscode.window.showWorkspaceFolderPick();
}

export function deactivate() {}