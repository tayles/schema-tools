import { Card, useMantineColorScheme } from '@mantine/core';

import CodeEditor from './CodeEditor';
import CopyButton from './CopyToClipboardButton';
import FormatButton from './FormatButton';
import Panel from './Panel';
import ProblemsPanel from './ProblemsPanel';
import ValidLabel from './ValidLabel';
import type { WorkerRequest } from '@/workers/worker-thread';
import { useEffect } from 'react';
import { useSchemaStore } from '@/store/state';

const JsonPanel = () => {
  const { colorScheme } = useMantineColorScheme();
  const rawData = useSchemaStore((state) => state.rawData);
  const isParseable = useSchemaStore((state) => state.dataParseable);
  const isValid = useSchemaStore((state) => state.dataValid);
  const isFormatted = useSchemaStore((state) => state.dataFormatted);
  const errors = useSchemaStore((state) => state.dataErrors);
  const workerRef = useSchemaStore((state) => state.workerRef);
  const editorRef = useSchemaStore((state) => state.dataEditorRef);
  const setRawData = useSchemaStore((state) => state.setRawData);
  const onDataMarkersValidation = useSchemaStore(
    (state) => state.onDataMarkersValidation,
  );
  const onDataProblemClick = useSchemaStore(
    (state) => state.onDataProblemClick,
  );

  const language = 'json';

  useEffect(() => {
    sendMessageToWorker({
      command: 'input-change',
      thing: 'data',
      language,
      input: rawData,
    });
  }, [language, rawData]);

  const handleFormat = () => {
    sendMessageToWorker({
      command: 'format',
      thing: 'data',
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
          <CopyButton thing="data" text={rawData} />
        </div>

        <Card.Section sx={{ flex: 1, display: 'flex' }}>
          <CodeEditor
            editorRef={editorRef}
            language={language}
            code={rawData}
            onChange={setRawData}
            onMarkersValidation={onDataMarkersValidation}
            theme={colorScheme === 'dark' ? 'vs-dark' : 'light'}
          />
        </Card.Section>

        <ProblemsPanel errors={errors} onClick={onDataProblemClick} />
      </div>
    </Panel>
  );
};

export default JsonPanel;
