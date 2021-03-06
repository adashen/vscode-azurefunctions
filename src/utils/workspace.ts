/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as vscode from 'vscode';
import { localize } from '../localize';
import * as uiUtil from './ui';

export async function selectWorkspaceFolder(placeholder: string): Promise<string> {
    const browse: string = ':browse';
    let folder: uiUtil.PickWithData<string> | undefined;
    if (vscode.workspace.workspaceFolders) {
        let folderPicks: uiUtil.PickWithData<string>[] = [new uiUtil.PickWithData(browse, localize('azFunc.browse', '$(file-directory) Browse...'))];
        folderPicks = folderPicks.concat(vscode.workspace.workspaceFolders.map((f: vscode.WorkspaceFolder) => new uiUtil.PickWithData('', f.uri.fsPath)));

        folder = await uiUtil.showQuickPick<string>(folderPicks, placeholder);
    }

    return folder && folder.data !== browse ? folder.label : await uiUtil.showFolderDialog();
}

export function isFolderOpenInWorkspace(fsPath: string): boolean {
    if (vscode.workspace.workspaceFolders) {
        if (!fsPath.endsWith(path.sep)) {
            fsPath = fsPath + path.sep;
        }

        const folder: vscode.WorkspaceFolder | undefined = vscode.workspace.workspaceFolders.find((f: vscode.WorkspaceFolder): boolean => {
            return fsPath.startsWith(f.uri.fsPath);
        });

        return folder !== undefined;
    } else {
        return false;
    }
}
