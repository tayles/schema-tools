import * as exampleDataJson from '../../public/examples/data.json';
import * as exampleSchemaJson from '../../public/examples/schema.json';

import { type JSONSchema, type JSONValue, jsonToString } from '@/utils/json';

import create from 'zustand';

interface Error {
  message: string;
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
  schemaErrors: Error[];
  dataErrors: Error[];

  setSchema: (schema: JSONSchema) => void;
  setData: (data: JSONValue) => void;
  setRawSchema: (rawSchema: string) => void;
  setRawData: (rawData: string) => void;
  setSchemaErrors: (errors: Error[]) => void;
  setDataErrors: (errors: Error[]) => void;
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
  setSchema: (schema: JSONSchema) => set(() => ({ schema, schemaErrors: [] })),
  setData: (data: JSONValue) => set(() => ({ data, dataErrors: [] })),
  setRawSchema: (rawSchema: string) => set(() => ({ schema: null, rawSchema })),
  setRawData: (rawData: string) => set(() => ({ data: null, rawData })),
  setSchemaErrors: (schemaErrors: Error[]) =>
    set(() => ({ schemaErrors, schema: null })),
  setDataErrors: (dataErrors: Error[]) =>
    set(() => ({ dataErrors, data: null })),
}));
