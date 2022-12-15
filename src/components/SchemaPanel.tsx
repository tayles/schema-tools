import * as exampleJson from '../../public/examples/schema.json';

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

const SchemaPanel = () => {
  const [file, setFile] = useState<File>();
  const [value, setValue] = useState(JSON.stringify(exampleJson, undefined, 2));
  const [language, setLanguage] = useState<SupportedLanguages>('json');

  const formatWorkerRef = useRef<Worker>();
  const convertWorkerRef = useRef<Worker>();

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
        .then((contents) => setValue(contents))
        .catch(console.error);
    }
  }, [file]);

  // prettier formatting
  useEffect(() => {
    formatWorkerRef.current = new Worker(
      new URL('../workers/formatter.ts', import.meta.url),
    );
    formatWorkerRef.current.onmessage = (
      event: MessageEvent<FormatResponse>,
    ) => {
      setValue('');
      setLanguage(event.data.language);
      setValue(event.data.value);
    };
    return () => {
      formatWorkerRef.current?.terminate();
    };
  }, []);

  // convert JSON <> YAML
  useEffect(() => {
    convertWorkerRef.current = new Worker(
      new URL('../workers/converter.ts', import.meta.url),
    );
    convertWorkerRef.current.onmessage = (
      event: MessageEvent<ConvertResponse>,
    ) => {
      setValue('');
      setLanguage(event.data.language);
      setValue(event.data.value);
    };
    return () => {
      convertWorkerRef.current?.terminate();
    };
  }, []);

  const handleFormat = () => {
    const req: FormatRequest = {
      filename: file?.name ?? '',
      language,
      value,
    };
    formatWorkerRef.current?.postMessage(req);
  };

  const handleConvert = () => {
    const req: ConvertRequest = {
      filename: file?.name ?? '',
      language,
      value,
    };
    convertWorkerRef.current?.postMessage(req);
  };

  const handleLanguageChange = (language: SupportedLanguages) => {
    handleConvert();
  };

  return (
    <Panel title="Schema">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex gap-2">
          <ButtonGroup
            onClick={handleLanguageChange}
            buttons={SupportedLanguagesArr}
          />
          <Button onClick={handleFormat}>Format</Button>
        </div>
        <FileUploadInput onFileLoad={setFile} />
        <div className="flex-1">
          <CodeEditor language={language} code={value} onChange={setValue} />
        </div>
      </div>
    </Panel>
  );
};

export default SchemaPanel;
