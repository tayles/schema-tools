import type * as monaco from 'monaco-editor';

import type { ErrorInstance, Severity } from './model';

import type { LineAndColumn } from './json-parse-source-map';
import { type Monaco, loader } from '@monaco-editor/react';

// re-export/shorten some types
export type ICodeEditor = monaco.editor.IStandaloneCodeEditor;
export type IMarker = monaco.editor.IMarker;
export type IOptions = monaco.editor.IStandaloneEditorConstructionOptions;
export type MonacoInstance = Monaco;
export interface MarkerLocation {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

export function generateErrorFromMarker(marker: IMarker): ErrorInstance {
  const { startLineNumber, startColumn, endLineNumber, endColumn } = marker;
  return {
    keyword: marker.code as string,
    message: marker.message,
    schemaPath: '',
    instancePath: '',
    params: {},
    severity: markerSeverityMap[marker.severity],
    markerLocation: { startLineNumber, startColumn, endLineNumber, endColumn },
  };
}

export const markerSeverityMap: Record<monaco.MarkerSeverity, Severity> = {
  [1]: 'debug',
  [2]: 'info',
  [4]: 'warn',
  [8]: 'error',
};

export function selectRegion(
  start: LineAndColumn,
  end: LineAndColumn,
  editor: ICodeEditor,
  monaco: MonacoInstance,
): boolean {
  editor.setSelection(
    new monaco.Selection(start.line, start.column, end.line, end.column),
  );
  editor.revealLineInCenter(start.line, 0);
  editor.focus();
  return true;
}

export async function loadMonacoInstance(): Promise<MonacoInstance> {
  return await loader.init();
}
