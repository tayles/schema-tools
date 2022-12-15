import CodeEditor, { type SupportedLanguages } from './CodeEditor';
import { useEffect, useRef, useState } from 'react';

import FileUploadInput from './FileUploadInput';
import Panel from './Panel';
import { getFileContents, getFileExtension } from '@/utils/file';

const SchemaPanel = () => {
  const [file, setFile] = useState<File>();
  const [value, setValue] = useState('');
  const [language, setLanguage] = useState<SupportedLanguages>('json');

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

  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/formatter.ts', import.meta.url),
    );
    workerRef.current.onmessage = (event: MessageEvent<string>) =>
      setValue(event.data);
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleWork = () => {
    workerRef.current?.postMessage(value);
  };

  return (
    <Panel title="Schema">
      <button onClick={handleWork}>Format</button>
      <FileUploadInput onFileLoad={setFile} />
      <div className="flex-1">
        <CodeEditor language={language} code={value} onChange={setValue} />
      </div>
    </Panel>
  );
};

export default SchemaPanel;
