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
import ValidLabel from './ValidLabel';
import ErrorCountBadge from './ErrorCountBadge';

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
          <Button onClick={() => copy(rawSchema)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
              />
            </svg>
          </Button>
          <ErrorCountBadge count={schemaErrors?.length} />
          <ValidLabel valid={isSchemaValid} />
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
