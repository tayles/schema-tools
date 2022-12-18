import { Card, useMantineColorScheme } from '@mantine/core';
import type { WorkerRequest, WorkerResult } from '@/workers/worker-thread';
import { useEffect, useRef } from 'react';

import CodeEditor from './CodeEditor';
import CopyButton from './CopyToClipboardButton';
import FormatButton from './FormatButton';
import Panel from './Panel';
import ProblemsPanel from './ProblemsPanel';
import ValidLabel from './ValidLabel';
import { useSchemaStore } from '@/store/state';

const JsonPanel = () => {
  const { colorScheme } = useMantineColorScheme();
  const rawSchema = useSchemaStore((state) => state.rawSchema);
  const isParseable = useSchemaStore((state) => state.schemaParseable);
  const isValid = useSchemaStore((state) => state.schemaValid);
  const isFormatted = useSchemaStore((state) => state.schemaFormatted);
  const errors = useSchemaStore((state) => state.schemaErrors);

  const setRawSchema = useSchemaStore((state) => state.setRawSchema);
  const setRawData = useSchemaStore((state) => state.setRawData);
  const setWorkerRef = useSchemaStore((state) => state.setWorkerRef);
  const gotWorkerMessage = useSchemaStore((state) => state.gotWorkerMessage);

  const workerRef = useRef<Worker>();
  setWorkerRef(workerRef);

  const language = 'json';

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

  function sendMessageToWorker(request: WorkerRequest) {
    workerRef.current?.postMessage(request);
  }

  return (
    <Panel>
      <div className="flex flex-1 flex-col">
        <div className="mb-2 flex items-center gap-2">
          <h2>JSON</h2>
          <ValidLabel valid={isParseable && isValid} />
          <div className="flex-1"></div>
          <FormatButton onClick={handleFormat} disabled={isFormatted} />
          <CopyButton thing="schema" text={rawSchema} />
        </div>

        <Card.Section sx={{ flex: 1, display: 'flex' }}>
          <CodeEditor
            language={language}
            code={rawSchema}
            onChange={setRawSchema}
            theme={colorScheme === 'dark' ? 'vs-dark' : 'light'}
          />
        </Card.Section>

        <ProblemsPanel errors={errors} />
      </div>
    </Panel>
  );
};

export default JsonPanel;
