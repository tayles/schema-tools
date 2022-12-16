import { type SupportedLanguages } from '@/utils/model';
import { type JSONSchema, stringToJson } from '@/utils/json';
import type { ErrorObject } from 'ajv';
import Ajv from 'ajv';
import {
  generateError,
  validateJsonSchema,
} from '@/utils/validate-json-schema';
import { formatJson } from '@/utils/prettier-format';

const ajv = new Ajv({ allErrors: true, verbose: true, strict: true });

export interface ValidationRequest {
  language: SupportedLanguages;
  rawSchema: string;
}

export interface ValidationResponse {
  isFormatted: boolean;
  formattedSchema: string | null;
  isValidSchema: boolean;
  schemaObject: JSONSchema | null;
  errors: ErrorObject[];
}

/**
 * Validates a JSON Schema
 */
addEventListener('message', (event: MessageEvent<ValidationRequest>) => {
  const { rawSchema } = event.data;

  let response: ValidationResponse;

  let schemaObject: JSONSchema;

  try {
    console.time('parse');
    schemaObject = stringToJson(rawSchema) as JSONSchema;
  } catch (err) {
    // failed to parse
    response = {
      isFormatted: false,
      formattedSchema: null,
      isValidSchema: false,
      schemaObject: null,
      errors: [generateError('parse', err as Error)],
    };
    postMessage(response);
    return;
  } finally {
    console.timeEnd('parse');
  }

  try {
    console.time('validate');
    const validationResult = validateJsonSchema(schemaObject, ajv);

    if (validationResult.ok) {
      response = {
        isFormatted: false,
        formattedSchema: null,
        isValidSchema: true,
        schemaObject,
        errors: [],
      };
      postMessage(response);
    } else {
      response = {
        isFormatted: false,
        formattedSchema: null,
        isValidSchema: false,
        schemaObject: null,
        errors: validationResult.errors,
      };
      postMessage(response);
      return;
    }
  } catch (err) {
    // failed to validate
    response = {
      isFormatted: false,
      formattedSchema: null,
      isValidSchema: false,
      schemaObject: null,
      errors: [generateError('validate', err as Error)],
    };
    postMessage(response);
    return;
  } finally {
    console.timeEnd('validate');
  }

  try {
    console.time('format');
    const formattedSchema = formatJson(rawSchema);
    const isFormatted =
      formattedSchema.length === rawSchema.length &&
      formattedSchema === rawSchema;

    response = {
      isFormatted,
      formattedSchema,
      isValidSchema: true,
      schemaObject,
      errors: [],
    };
    postMessage(response);
  } catch (err) {
    // failed to parse
    response = {
      isFormatted: false,
      formattedSchema: null,
      isValidSchema: false,
      schemaObject: null,
      errors: [generateError('format', err as Error)],
    };
    postMessage(response);
    return;
  } finally {
    console.timeEnd('format');
  }
});
