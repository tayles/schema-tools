import {
  type ICodeEditor,
  type IMarker,
  generateErrorFromMarker,
  selectRegion,
  type MonacoInstance,
  loadMonacoInstance,
  applyJsonSchema,
} from '@/utils/monaco';
import { type MutableRefObject, createRef } from 'react';

import type { ErrorInstance } from '@/utils/model';
import type { WorkerResult } from '@/workers/worker-thread';
import create from 'zustand';
import exampleDataJson from '../../public/examples/data.json';
import exampleSchemaJson from '../../public/examples/schema.json';
import {
  type JSONSchema,
  jsonToString,
  stringToJson,
} from '@/utils/json-to-string';
import type { LineAndColumn } from '@/utils/json-parse-source-map';

interface SchemaState {
  schemaVersion: string | null;

  rawSchema: string;
  rawData: string;

  schemaParseable: boolean;
  schemaValid: boolean;
  schemaFormatted: boolean;

  dataParseable: boolean;
  dataValid: boolean;
  dataFormatted: boolean;

  schemaErrors: ErrorInstance[];
  dataErrors: ErrorInstance[];

  workerRef: MutableRefObject<Worker>;
  monacoRef: MutableRefObject<MonacoInstance>;
  schemaEditorRef: MutableRefObject<ICodeEditor>;
  dataEditorRef: MutableRefObject<ICodeEditor>;

  setRawSchema: (rawSchema: string) => void;
  setRawData: (rawData: string) => void;

  gotWorkerMessage: (result: WorkerResult) => void;

  onSchemaMarkersValidation: (markers: IMarker[]) => void;
  onDataMarkersValidation: (markers: IMarker[]) => void;

  onSchemaProblemClick: (error: ErrorInstance) => void;
  onDataProblemClick: (error: ErrorInstance) => void;

  needsMonacoEditor: () => void;
}

export const useSchemaStore = create<SchemaState>((set, get) => ({
  schemaVersion: null,

  rawSchema: jsonToString(exampleSchemaJson),
  rawData: jsonToString(exampleDataJson),

  schemaParseable: true,
  schemaValid: true,
  schemaFormatted: true,

  dataParseable: true,
  dataValid: true,
  dataFormatted: true,

  schemaErrors: [],
  dataErrors: [],

  workerRef: createRef<Worker>() as React.MutableRefObject<Worker>,
  monacoRef:
    createRef<MonacoInstance>() as React.MutableRefObject<MonacoInstance>,
  schemaEditorRef:
    createRef<ICodeEditor>() as React.MutableRefObject<ICodeEditor>,
  dataEditorRef:
    createRef<ICodeEditor>() as React.MutableRefObject<ICodeEditor>,

  setRawSchema: (rawSchema: string) =>
    set((state) => {
      const schema = stringToJson(rawSchema) as JSONSchema;
      applyJsonSchema(state.monacoRef.current, schema, 'data-panel');

      return { rawSchema };
    }),
  setRawData: (rawData: string) => set(() => ({ rawData })),

  gotWorkerMessage: (result: WorkerResult) =>
    set(() => {
      switch (result.command) {
        case 'parse-result':
          return result.thing === 'schema'
            ? { schemaParseable: result.valid }
            : { dataParseable: result.valid };
          break;
        case 'validation-result':
          return result.thing === 'schema'
            ? { schemaErrors: result.errors, schemaValid: result.valid }
            : { dataErrors: result.errors, dataValid: result.valid };
          break;
        case 'formatting-result':
          return result.thing === 'schema'
            ? { schemaFormatted: result.formatted }
            : { dataFormatted: result.formatted };
          break;
        case 'format-payload':
          return result.thing === 'schema'
            ? { rawSchema: result.formatted ?? '' }
            : { rawData: result.formatted ?? '' };
          break;
        case 'convert-result':
          return result.thing === 'schema'
            ? { rawSchema: result.converted ?? '' }
            : { rawData: result.converted ?? '' };
          break;
        case 'derive-schema-result':
          return { rawSchema: result.schema ?? '' };
        case 'derive-data-result':
          return { rawData: result.data ?? '', dataErrors: result.errors };
      }
    }),

  onSchemaMarkersValidation: (markers: IMarker[]) => {
    const schemaErrors = markers.map((m) => generateErrorFromMarker(m));
    set(() => ({ schemaErrors }));
  },
  onDataMarkersValidation: (markers: IMarker[]) => {
    const dataErrors = markers.map((m) => generateErrorFromMarker(m));
    set(() => ({ dataErrors }));
  },

  onSchemaProblemClick: (error: ErrorInstance) =>
    set((state) =>
      highlightEditorErrorInstance(
        error,
        state.monacoRef.current,
        state.schemaEditorRef.current,
      ),
    ),
  onDataProblemClick: (error: ErrorInstance) =>
    set((state) =>
      highlightEditorErrorInstance(
        error,
        state.monacoRef.current,
        state.dataEditorRef.current,
      ),
    ),

  needsMonacoEditor: async () => {
    const monacoRef = get().monacoRef;
    if (!monacoRef.current) {
      // need to initialise monaco instance
      const monacoInstance = await loadMonacoInstance();
      console.log('Got monaco instance', monacoInstance);
      monacoRef.current = monacoInstance;
    }
  },
}));

function highlightEditorErrorInstance(
  error: ErrorInstance,
  monaco?: MonacoInstance,
  editor?: ICodeEditor,
) {
  if (!monaco || !editor) {
    console.warn('No editor instance', monaco, editor);
    return {};
  }

  if (error.start && error.end) {
    selectRegion(error.start, error.end, editor, monaco);
  }

  return {};
}
