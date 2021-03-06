// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

import { inject, injectable } from 'inversify';
import * as vscode from 'vscode';
import { IServiceContainer } from '../../ioc/types';
import { ICodeWatcher, IDataScienceCodeLensProvider } from '../types';
import { CodeWatcher } from './codewatcher';

@injectable()
export class DataScienceCodeLensProvider implements IDataScienceCodeLensProvider {
    private activeCodeWatchers: ICodeWatcher[] = [];
    constructor(@inject(IServiceContainer) private serviceContainer: IServiceContainer)
    {
    }

    // CodeLensProvider interface
    // Some implementation based on DonJayamanne's jupyter extension work
    public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken):
        vscode.CodeLens[] {
            // See if we already have a watcher for this file and version
            const codeWatcher: ICodeWatcher | undefined = this.matchWatcher(document.fileName, document.version);
            if (codeWatcher) {
                return codeWatcher.getCodeLenses();
            }

            // Create a new watcher for this file
            const newCodeWatcher = new CodeWatcher(this.serviceContainer, document);
            this.activeCodeWatchers.push(newCodeWatcher);
            return newCodeWatcher.getCodeLenses();
    }

    // IDataScienceCodeLensProvider interface
    public getCodeWatcher(document: vscode.TextDocument): ICodeWatcher | undefined {
        return this.matchWatcher(document.fileName, document.version);
    }

    private matchWatcher(fileName: string, version: number) : ICodeWatcher | undefined {
        const index = this.activeCodeWatchers.findIndex(item => item.getFileName() === fileName);
        if (index >= 0) {
            const item = this.activeCodeWatchers[index];
            if (item.getVersion() === version) {
                return item;
            }
            // If we have an old version remove it from the active list
            this.activeCodeWatchers.splice(index, 1);
        }
        return undefined;
    }
}
