import type {
  FormattingResult,
  ParseResult,
  ValidationResult,
} from '@/workers/worker-thread';

import type { MutableRefObject } from 'react';
import create from 'zustand';
import exampleDataJson from '../../public/examples/data.json';
import exampleSchemaJson from '../../public/examples/schema.json';
import { jsonToString } from '@/utils/json';

interface ErrorObject {
  message: string;
  [x: string]: unknown;
}

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

  schemaErrors: ErrorObject[];
  dataErrors: ErrorObject[];

  workerRef: MutableRefObject<Worker | undefined> | null;

  setRawSchema: (rawSchema: string) => void;
  setRawData: (rawData: string) => void;

  setSchemaErrors: (errors: ErrorObject[]) => void;
  setDataErrors: (errors: ErrorObject[]) => void;

  setWorkerRef: (workerRef: MutableRefObject<Worker | undefined>) => void;

  gotParseResult: (result: ParseResult) => void;
  gotValidationResult: (result: ValidationResult) => void;
  gotFormattingResult: (result: FormattingResult) => void;
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

  setSchemaErrors: (schemaErrors: ErrorObject[]) =>
    set(() => ({ schemaErrors })),
  setDataErrors: (dataErrors: ErrorObject[]) => set(() => ({ dataErrors })),

  setWorkerRef: (workerRef: MutableRefObject<Worker | undefined>) =>
    set(() => ({ workerRef })),

  gotParseResult: (result: ParseResult) =>
    set(() => {
      return result.thing === 'schema'
        ? { schemaErrors: result.errors, schemaParseable: result.valid }
        : { dataErrors: result.errors, dataParseable: result.valid };
    }),
  gotValidationResult: (result: ValidationResult) =>
    set(() => {
      return result.thing === 'schema'
        ? { schemaErrors: result.errors, schemaValid: result.valid }
        : { dataErrors: result.errors, dataValid: result.valid };
    }),
  gotFormattingResult: (result: FormattingResult) =>
    set(() => {
      return result.thing === 'schema'
        ? { schemaFormatted: result.formatted }
        : { dataFormatted: result.formatted };
    }),
}));
