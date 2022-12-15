import { getFileContents, getFileExtension } from '@/utils/file';
import { useEffect, useRef, useState } from 'react';

import Button from './Button';
import CodeEditor from './CodeEditor';
import FileUploadInput from './FileUploadInput';
import Panel from './Panel';
import { SupportedLanguagesArr, type SupportedLanguages } from '@/utils/model';
import type { ConvertResponse, ConvertRequest } from '@/workers/converter';
import type { FormatResponse, FormatRequest } from '@/workers/formatter';
import ButtonGroup from './ButtonGroup';
import type {
  GenerateFakeDataRequest,
  GenerateFakeDataResponse,
} from '@/workers/faker';
import { useSchemaStore } from '@/store/state';
import { useCopyToClipboard } from 'usehooks-ts';
import { type JSONSchema, stringToJson } from '@/utils/json';

const SchemaPanel = () => {
  const setSchema = useSchemaStore((state) => state.setSchema);
  const rawSchema = useSchemaStore((state) => state.rawSchema);
  const setRawSchema = useSchemaStore((state) => state.setRawSchema);
  const setRawData = useSchemaStore((state) => state.setRawData);
  const isSchemaValid = useSchemaStore((state) => state.schemaValid);
  const setSchemaErrors = useSchemaStore((state) => state.setSchemaErrors);
  const schemaErrors = useSchemaStore((state) => state.schemaErrors);
  const [, copy] = useCopyToClipboard();

  const [file, setFile] = useState<File>();
  const [language, setLanguage] = useState<SupportedLanguages>('json');

  const formatWorkerRef = useRef<Worker>();
  const convertWorkerRef = useRef<Worker>();
  const generateDataWorkerRef = useRef<Worker>();

  useEffect(() => {
    try {
      const schema = stringToJson(rawSchema);
      setSchema(schema as JSONSchema);
    } catch (err) {
      console.log('Invalid json', err);
      setSchemaErrors([
        {
          message: (err as Error).message,
        },
      ]);
    }
  }, [rawSchema, setSchema, setSchemaErrors]);

  useEffect(() => {
    if (file) {
      const extension = getFileExtension(file);
      switch (extension) {
        case 'yaml':
        case 'yml':
          setLanguage('yaml');
          break;
        case 'json':
          setLanguage('json');
          break;
        default:
          throw new Error('Unsupported file format');
      }

      getFileContents(file)
        .then((contents) => setRawSchema(contents))
        .catch(console.error);
    }
  }, [file, setRawSchema]);

  // prettier formatting
  useEffect(() => {
    formatWorkerRef.current = new Worker(
      new URL('../workers/formatter.ts', import.meta.url),
    );
    formatWorkerRef.current.onmessage = (
      event: MessageEvent<FormatResponse>,
    ) => {
      setRawSchema('');
      setLanguage(event.data.language);
      setRawSchema(event.data.value);
    };
    return () => {
      formatWorkerRef.current?.terminate();
    };
  }, [setRawSchema]);

  // convert JSON <> YAML
  useEffect(() => {
    convertWorkerRef.current = new Worker(
      new URL('../workers/converter.ts', import.meta.url),
    );
    convertWorkerRef.current.onmessage = (
      event: MessageEvent<ConvertResponse>,
    ) => {
      setRawSchema('');
      setLanguage(event.data.language);
      setRawSchema(event.data.value);
    };
    return () => {
      convertWorkerRef.current?.terminate();
    };
  }, [setRawSchema]);

  // generate data from json schema
  useEffect(() => {
    generateDataWorkerRef.current = new Worker(
      new URL('../workers/faker.ts', import.meta.url),
    );
    generateDataWorkerRef.current.onmessage = (
      event: MessageEvent<GenerateFakeDataResponse>,
    ) => {
      setRawData(event.data.data);
    };
    return () => {
      generateDataWorkerRef.current?.terminate();
    };
  }, [setRawData]);

  const handleFormat = () => {
    const req: FormatRequest = {
      filename: file?.name ?? '',
      language,
      value: rawSchema ?? '',
    };
    formatWorkerRef.current?.postMessage(req);
  };

  const handleGenerateData = () => {
    const req: GenerateFakeDataRequest = {
      schema: rawSchema ?? '',
    };
    generateDataWorkerRef.current?.postMessage(req);
  };

  const handleConvert = () => {
    const req: ConvertRequest = {
      filename: file?.name ?? '',
      language,
      value: rawSchema ?? '',
    };
    convertWorkerRef.current?.postMessage(req);
  };

  const handleLanguageChange = () => {
    handleConvert();
  };

  return (
    <Panel title="Schema">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <ButtonGroup
            onClick={handleLanguageChange}
            buttons={Array.from(SupportedLanguagesArr)}
          />
          <Button onClick={handleFormat}>Format</Button>
          <Button onClick={handleGenerateData}>Gen Data</Button>
          <Button onClick={() => copy(rawSchema)}>Copy</Button>
          {schemaErrors?.length && (
            <span className="inline-block whitespace-nowrap rounded bg-red-600 py-1 px-2.5 text-center align-baseline text-xs font-bold leading-none text-white">
              {schemaErrors.length}
            </span>
          )}
          <span>{isSchemaValid ? '✅' : '❌'}</span>
        </div>
        <FileUploadInput onFileLoad={setFile} />
        <div className="flex-1">
          <CodeEditor
            language={language}
            code={rawSchema}
            onChange={setRawSchema}
          />
        </div>
      </div>
    </Panel>
  );
};

export default SchemaPanel;
