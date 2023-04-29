import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { minimatch } from 'minimatch';
import { getWorkspaceFolder, getConfig, createOutputFolder, writeOutputFiles } from './utils';

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

        const { maxFileSize, folderName, ignoreFiles } = getConfig();
        const newFolderPath = createOutputFolder(folder, folderName);

        for (const file of files) {
            const fileName = path.basename(file.fsPath);
            const baseName = path.parse(fileName).name;
            const fileExt = path.extname(file.fsPath).replace('.', '');

            if (ignoreFiles.some((pattern: string) => minimatch(fileName, pattern))) {
                // Skip this file.
                continue;
            }

            const fileContent = fs.readFileSync(file.fsPath).toString();
            const content = `--- FILENAME: ${fileName}\n${fileContent}\n`;

            writeOutputFiles(content, newFolderPath, maxFileSize, `${baseName}_${fileExt}`);
        }

        vscode.window.showInformationMessage(`ChatGPT files created successfully in folder ${newFolderPath}`);
    });

    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('chatgpt-append.buildSingleFile', async (fileUri: vscode.Uri) => {
        if (!fileUri) {
            return;
        }

        const folder = await getWorkspaceFolder();
        if (!folder) {
            return;
        }

        const document = await vscode.workspace.openTextDocument(fileUri);
        const fileName = path.basename(document.fileName);
        const baseName = path.parse(fileName).name;
        const fileExt = path.extname(fileName).replace('.', '');
        const fileContent = document.getText();
        let content = `--- FILENAME: ${fileName}\n${fileContent}\n`;

        const { maxFileSize, folderName, ignoreFiles } = getConfig();
        const newFolderPath = createOutputFolder(folder, folderName);

        writeOutputFiles(content, newFolderPath, maxFileSize, `${baseName}_${fileExt}`);

        vscode.window.showInformationMessage(`ChatGPT files created successfully in folder ${newFolderPath}`);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}