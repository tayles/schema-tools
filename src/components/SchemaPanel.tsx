import { getFileContents, getFileExtension } from '@/utils/file';
import { useEffect, useRef, useState } from 'react';

import CodeEditor from './CodeEditor';
import FileUploadInput from './FileUploadInput';
import Panel from './Panel';
import { type SupportedLanguages } from '@/utils/model';
import { useSchemaStore } from '@/store/state';
import ValidLabel from './ValidLabel';
import CopyButton from './CopyToClipboardButton';
import type { WorkerResult, WorkerRequest } from '@/workers/worker-thread';
import { SegmentedControl } from '@mantine/core';
import FormatButton from './FormatButton';
import { IconDice5 } from '@tabler/icons';
import IconButton from './IconButton';
import ProblemsPanel from './ProblemsPanel';

const SchemaPanel = () => {
  const rawSchema = useSchemaStore((state) => state.rawSchema);
  const isParseable = useSchemaStore((state) => state.schemaParseable);
  const isValid = useSchemaStore((state) => state.schemaValid);
  const isFormatted = useSchemaStore((state) => state.schemaFormatted);
  const errors = useSchemaStore((state) => state.schemaErrors);
  const setRawSchema = useSchemaStore((state) => state.setRawSchema);
  const setRawData = useSchemaStore((state) => state.setRawData);
  const setWorkerRef = useSchemaStore((state) => state.setWorkerRef);
  const gotWorkerMessage = useSchemaStore((state) => state.gotWorkerMessage);

  const [file, setFile] = useState<File>();
  const [language, setLanguage] = useState<SupportedLanguages>('json');

  const workerRef = useRef<Worker>();
  setWorkerRef(workerRef);

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

  // setup communication with worker thread
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/worker-thread.ts', import.meta.url),
    );
    workerRef.current.onmessage = (event: MessageEvent<WorkerResult>) => {
      const result = event.data;
      console.log(':: UI Thread IN', result);
      gotWorkerMessage(result);
    };
    return () => {
      workerRef.current?.terminate();
    };
  }, [workerRef, setRawSchema, setRawData, gotWorkerMessage]);

  useEffect(() => {
    sendMessageToWorker({
      command: 'input-change',
      thing: 'schema',
      language,
      input: rawSchema,
    });
  }, [language, rawSchema]);

  const handleFormat = () => {
    sendMessageToWorker({
      command: 'format',
      thing: 'schema',
      language,
    });
  };

  const handleConvert = (language: SupportedLanguages) => {
    setLanguage(language);
    sendMessageToWorker({
      command: 'convert',
      thing: 'schema',
      language,
    });
  };

  const handleDeriveData = () => {
    sendMessageToWorker({
      command: 'derive-data',
    });
  };

  function sendMessageToWorker(request: WorkerRequest) {
    workerRef.current?.postMessage(request);
  }

  return (
    <Panel title="Schema">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <SegmentedControl
            size="xs"
            data={[
              { label: 'Json', value: 'json' },
              { label: 'Yaml', value: 'yaml' },
            ]}
            onChange={(language: string) =>
              handleConvert(language as SupportedLanguages)
            }
          />
          <FormatButton onClick={handleFormat} disabled={isFormatted} />
          <IconButton
            tooltip="Generate data"
            onClick={handleDeriveData}
            icon={<IconDice5 size={16} />}
          />
          <FileUploadInput onFileLoad={setFile} />
          <CopyButton thing="schema" text={rawSchema} />
          <ValidLabel valid={isParseable && isValid} />
        </div>
        <div className="flex-1">
          <CodeEditor
            language={language}
            code={rawSchema}
            onChange={setRawSchema}
          />
        </div>

        <ProblemsPanel errors={errors} />
      </div>
    </Panel>
  );
};

export default SchemaPanel;
