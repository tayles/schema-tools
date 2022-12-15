import * as exampleDataJson from '../../public/examples/data.json';
import * as exampleSchemaJson from '../../public/examples/schema.json';

import type { JSONValue } from 'superjson/dist/types';
import create from 'zustand';
import { jsonToString } from '@/utils/json';

interface Error {
  message: string;
}

interface SchemaState {
  schema: JSONValue | null;
  data: JSONValue | null;
  schemaVersion: string | null;
  rawSchema: string;
  rawData: string;
  schemaValid: boolean;
  schemaFormatted: boolean;
  dataValid: boolean;
  dataFormatted: boolean;
  errors: Error[];

  setSchema: (schema: JSONValue) => void;
  setData: (data: JSONValue) => void;
  setRawSchema: (rawSchema: string) => void;
  setRawData: (rawData: string) => void;
}

export const useSchemaStore = create<SchemaState>((set) => ({
  schema: exampleSchemaJson,
  data: exampleDataJson,
  schemaVersion: null,
  rawSchema: jsonToString(exampleSchemaJson),
  rawData: jsonToString(exampleDataJson),
  schemaValid: true,
  schemaFormatted: true,
  dataValid: true,
  dataFormatted: true,
  errors: [],
  setSchema: (schema: JSONValue) => set(() => ({ schema })),
  setData: (data: JSONValue) => set(() => ({ data })),
  setRawSchema: (rawSchema: string) => set(() => ({ schema: null, rawSchema })),
  setRawData: (rawData: string) => set(() => ({ data: null, rawData })),
}));
