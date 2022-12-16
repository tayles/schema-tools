import type { ErrorInstance } from '@/utils/model';
import type { MutableRefObject } from 'react';
import type { WorkerResult } from '@/workers/worker-thread';
import create from 'zustand';
import exampleDataJson from '../../public/examples/data.json';
import exampleSchemaJson from '../../public/examples/schema.json';
import { jsonToString } from '@/utils/json';

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

  workerRef: MutableRefObject<Worker | undefined> | null;

  setRawSchema: (rawSchema: string) => void;
  setRawData: (rawData: string) => void;

  setSchemaErrors: (errors: ErrorInstance[]) => void;
  setDataErrors: (errors: ErrorInstance[]) => void;

  setWorkerRef: (workerRef: MutableRefObject<Worker | undefined>) => void;

  gotWorkerMessage: (result: WorkerResult) => void;
}

export const useSchemaStore = create<SchemaState>((set) => ({
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

  workerRef: null,

  setRawSchema: (rawSchema: string) => set(() => ({ rawSchema })),
  setRawData: (rawData: string) => set(() => ({ rawData })),

  setSchemaErrors: (schemaErrors: ErrorInstance[]) =>
    set(() => ({ schemaErrors })),
  setDataErrors: (dataErrors: ErrorInstance[]) => set(() => ({ dataErrors })),

  setWorkerRef: (workerRef: MutableRefObject<Worker | undefined>) =>
    set(() => ({ workerRef })),

  gotWorkerMessage: (result: WorkerResult) =>
    set(() => {
      switch (result.command) {
        case 'parse-result':
          return result.thing === 'schema'
            ? { schemaErrors: result.errors, schemaParseable: result.valid }
            : { dataErrors: result.errors, dataParseable: result.valid };
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
}));
