import { jsonToString, stringToJson } from '@/utils/json';

import { JSONSchemaFaker } from 'json-schema-faker';

export interface GenerateFakeDataRequest {
  schema: string;
}

export interface GenerateFakeDataResponse {
  data: string;
}

function generateFakeData(str: string): string {
  const schema = stringToJson(str);
  return jsonToString(JSONSchemaFaker.generate(schema as any));
}

/**
 * Generate fake data from a json schema
 */
addEventListener('message', (event: MessageEvent<GenerateFakeDataRequest>) => {
  const { schema } = event.data;

  console.log(`Generate Data size [${schema.length}]`);

  console.time('generate');
  const data = generateFakeData(schema);
  console.timeEnd('generate');

  const response: GenerateFakeDataResponse = {
    data,
  };

  postMessage(response);
});
