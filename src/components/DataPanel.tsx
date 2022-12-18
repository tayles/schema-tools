import { getFileContents, getFileExtension } from '@/utils/file';
import { useEffect, useState } from 'react';

import CodeEditor from './CodeEditor';
import FileUploadInput from './FileUploadInput';
import Panel from './Panel';
import { type SupportedLanguages } from '@/utils/model';
import { useSchemaStore } from '@/store/state';
import ValidLabel from './ValidLabel';
import CopyButton from './CopyToClipboardButton';
import type { WorkerRequest } from '@/workers/worker-thread';
import FormatButton from './FormatButton';
import IconButton from './IconButton';
import { IconMathSymbols } from '@tabler/icons';
import ProblemsPanel from './ProblemsPanel';
import { Card } from '@mantine/core';

const DataPanel = () => {
  const isParseable = useSchemaStore((state) => state.dataParseable);
  const isValid = useSchemaStore((state) => state.dataValid);
  const isFormatted = useSchemaStore((state) => state.dataFormatted);
  const rawData = useSchemaStore((state) => state.rawData);
  const errors = useSchemaStore((state) => state.dataErrors);
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
    <Panel>
      <div className="flex flex-1 flex-col">
        <div className="mb-2 flex items-center gap-2">
          <h2>Data</h2>
          <ValidLabel valid={isParseable && isValid} />
          <div className="flex-1"></div>
          <IconButton
            tooltip="Derive schema from data"
            onClick={handleDeriveSchema}
            icon={<IconMathSymbols size={16} />}
          />
          <FormatButton onClick={handleFormat} disabled={isFormatted} />
          <FileUploadInput onFileLoad={setFile} />
          <CopyButton thing="data" text={rawData} />
        </div>

        <Card.Section sx={{ flex: 1, display: 'flex' }}>
          <CodeEditor
            language={language}
            code={rawData}
            onChange={setRawData}
          />
        </Card.Section>

        <ProblemsPanel errors={errors} />
      </div>
    </Panel>
  );
};

export default DataPanel;
