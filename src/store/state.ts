import * as exampleDataJson from '../../public/examples/data.json';
import * as exampleSchemaJson from '../../public/examples/schema.json';

import { type JSONSchema, type JSONValue, jsonToString } from '@/utils/json';

import create from 'zustand';
import { ValidationResponse } from '@/workers/validator';

interface ErrorObject {
  [x: string]: unknown;
}

interface SchemaState {
  schema: JSONSchema | null;
  data: JSONValue | null;
  schemaVersion: string | null;
  rawSchema: string;
  rawData: string;
  schemaValid: boolean;
  schemaFormatted: boolean;
  dataValid: boolean;
  dataFormatted: boolean;
  schemaErrors: ErrorObject[];
  dataErrors: ErrorObject[];

  setSchema: (schema: JSONSchema) => void;
  setData: (data: JSONValue) => void;
  setRawSchema: (rawSchema: string) => void;
  setRawData: (rawData: string) => void;
  setSchemaErrors: (errors: ErrorObject[]) => void;
  setDataErrors: (errors: ErrorObject[]) => void;

  gotValidationResponse: (result: ValidationResponse) => void;
}

export const useSchemaStore = create<SchemaState>((set) => ({
  schema: exampleSchemaJson as JSONSchema,
  data: exampleDataJson as unknown as JSONValue,
  schemaVersion: null,
  rawSchema: jsonToString(exampleSchemaJson),
  rawData: jsonToString(exampleDataJson),
  schemaValid: true,
  schemaFormatted: true,
  dataValid: true,
  dataFormatted: true,
  schemaErrors: [],
  dataErrors: [],
  setSchema: (schema: JSONSchema) =>
    set(() => ({ schema, schemaErrors: [], schemaValid: true })),
  setData: (data: JSONValue) =>
    set(() => ({ data, dataErrors: [], dataValid: true })),
  setRawSchema: (rawSchema: string) => set(() => ({ schema: null, rawSchema })),
  setRawData: (rawData: string) => set(() => ({ data: null, rawData })),
  setSchemaErrors: (schemaErrors: ErrorObject[]) =>
    set(() => ({ schemaErrors, schema: null, schemaValid: false })),
  setDataErrors: (dataErrors: ErrorObject[]) =>
    set(() => ({ dataErrors, data: null, dataValid: false })),

  gotValidationResponse: (result: ValidationResponse) =>
    set(() => ({
      schemaErrors: result.errors as any,
      schema: result.schemaObject,
      schemaFormatted: result.isFormatted,
      schemaValid: result.isValidSchema,
    })),
}));
