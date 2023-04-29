import * as vscode from 'vscode';
import { buildAllFiles, buildSingleFile } from './commands';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('chatgpt-append.build', buildAllFiles);
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('chatgpt-append.buildSingleFile', buildSingleFile);
    context.subscriptions.push(disposable);
}

export function deactivate() {}