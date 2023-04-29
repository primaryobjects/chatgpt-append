import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { minimatch } from 'minimatch';
import { getWorkspaceFolder, getConfig, createOutputFolder, writeOutputFiles } from './utils';

export async function buildAllFiles() {
    // Process all files.
    const folder = await getWorkspaceFolder();
    if (!folder) {
        return;
    }

    const { maxFileSize, folderName, ignoreFiles } = getConfig();
    const fileTypes = ['txt', 'py', 'js', 'css', 'cs', 'java', 'cpp', 'c', 'go', 'rb', 'php', 'swift', 'kt',
        'rs', 'sh', 'pl', 'm', 'f90', 'r', 'jl', 'lua', 'tcl', 'hs', 'ml', 'scm', 'clj', 'erl', 'lisp', 'scala',
        'html', 'htm', 'ts'];
    const exclude = `{**/node_modules/**,**/${folderName}/**}`;
    const files = await vscode.workspace.findFiles(`**/*.{${fileTypes.join(',')}}`, exclude);

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
}

export async function buildSingleFile(fileUri: vscode.Uri) {
    // Process single file.
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
}