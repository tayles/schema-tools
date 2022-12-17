import { getFileContents, getFileExtension } from '@/utils/file';
import { useEffect, useState } from 'react';

import CodeEditor from './CodeEditor';
import FileUploadInput from './FileUploadInput';
import Panel from './Panel';
import { type SupportedLanguages } from '@/utils/model';
import { useSchemaStore } from '@/store/state';
import Button from './Button';
import ValidLabel from './ValidLabel';
import ErrorCountBadge from './ErrorCountBadge';
import CopyButton from './CopyToClipboardButton';
import type { WorkerRequest } from '@/workers/worker-thread';

const DataPanel = () => {
  const isParseable = useSchemaStore((state) => state.dataParseable);
  const isValid = useSchemaStore((state) => state.dataValid);
  const isFormatted = useSchemaStore((state) => state.dataFormatted);
  const rawData = useSchemaStore((state) => state.rawData);
  const dataErrors = useSchemaStore((state) => state.dataErrors);
  const setRawData = useSchemaStore((state) => state.setRawData);
  const workerRef = useSchemaStore((state) => state.workerRef);

  const [file, setFile] = useState<File>();
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
        .then((contents) => setRawData(contents))
        .catch(console.error);
    }
  }, [file, setRawData]);

  useEffect(() => {
    sendMessageToWorker({
      command: 'input-change',
      thing: 'data',
      language,
      input: rawData,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, rawData]);

  const handleFormat = () => {
    sendMessageToWorker({
      command: 'format',
      thing: 'data',
      language,
    });
  };

  const handleDeriveSchema = () => {
    sendMessageToWorker({
      command: 'derive-schema',
    });
  };

  function sendMessageToWorker(request: WorkerRequest) {
    workerRef?.current?.postMessage(request);
  }

  return (
    <Panel title="Data">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <Button disabled={!isParseable} onClick={handleDeriveSchema}>
            Derive Schema
          </Button>
          <Button disabled={isFormatted} onClick={handleFormat}>
            Format {isFormatted ? '✅' : '❌'}
          </Button>
          <CopyButton thing="data" text={rawData} />
          <ErrorCountBadge count={dataErrors?.length} />
          <ValidLabel valid={isParseable && isValid} />
        </div>
        <FileUploadInput onFileLoad={setFile} />
        <div className="flex-1">
          <CodeEditor
            language={language}
            code={rawData}
            onChange={setRawData}
          />
        </div>
      </div>
    </Panel>
  );
};

export default DataPanel;
