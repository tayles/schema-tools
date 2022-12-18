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

const YamlPanel = () => {
  const { colorScheme } = useMantineColorScheme();
  const rawSchema = useSchemaStore((state) => state.rawSchema);
  const isParseable = useSchemaStore((state) => state.schemaParseable);
  const isValid = useSchemaStore((state) => state.schemaValid);
  const isFormatted = useSchemaStore((state) => state.schemaFormatted);
  const errors = useSchemaStore((state) => state.schemaErrors);
  const workerRef = useSchemaStore((state) => state.workerRef);
  const setRawSchema = useSchemaStore((state) => state.setRawSchema);

  const language = 'yaml';

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
    workerRef?.current?.postMessage(request);
  }

  return (
    <Panel>
      <div className="flex flex-1 flex-col">
        <div className="mb-2 flex items-center gap-2">
          <h2>YAML</h2>
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

export default YamlPanel;
