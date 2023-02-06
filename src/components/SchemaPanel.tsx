import { getFileContents, getFileExtension } from '@/utils/file';
import { useEffect, useState } from 'react';

import CodeEditor from './CodeEditor';
import FileUploadInput from './FileUploadInput';
import Panel from './Panel';
import { getOtherLanguage, type SupportedLanguages } from '@/utils/model';
import { useSchemaStore } from '@/store/state';
import ValidLabel from './ValidLabel';
import CopyButton from './CopyToClipboardButton';
import type { WorkerRequest } from '@/workers/worker-thread';
import {
  Card,
  SegmentedControl,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import FormatButton from './FormatButton';
import { IconDice5 } from '@tabler/icons-react';
import IconButton from './IconButton';
import ProblemsPanel from './ProblemsPanel';

const SchemaPanel = () => {
  const { colorScheme } = useMantineColorScheme();

  const rawSchema = useSchemaStore((state) => state.rawSchema);
  const isParseable = useSchemaStore((state) => state.schemaParseable);
  const isValid = useSchemaStore((state) => state.schemaValid);
  const isFormatted = useSchemaStore((state) => state.schemaFormatted);
  const errors = useSchemaStore((state) => state.schemaErrors);
  const workerRef = useSchemaStore((state) => state.workerRef);
  const editorRef = useSchemaStore((state) => state.schemaEditorRef);
  const setRawSchema = useSchemaStore((state) => state.setRawSchema);
  const onSchemaMarkersValidation = useSchemaStore(
    (state) => state.onSchemaMarkersValidation,
  );
  const onSchemaProblemClick = useSchemaStore(
    (state) => state.onSchemaProblemClick,
  );

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
        .then((contents) => setRawSchema(contents))
        .catch(console.error);
    }
  }, [file, setRawSchema]);

  useEffect(() => {
    sendMessageToWorker({
      command: 'input-change',
      thing: 'schema',
      language,
      input: rawSchema,
    });
  }, [rawSchema]);

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
    <Panel>
      <div className="flex flex-1 flex-col">
        <div className="mb-2 flex items-center gap-2">
          <h2>Schema</h2>
          <ValidLabel valid={isParseable && isValid} />
          <div className="flex-1"></div>
          <Tooltip label="Convert" withArrow position="top">
            <SegmentedControl
              size="xs"
              data={[
                { label: 'Json', value: 'json' },
                { label: 'Yaml', value: 'yaml' },
              ]}
              value={language}
              onChange={() => handleConvert(getOtherLanguage(language))}
            />
          </Tooltip>
          <FormatButton onClick={handleFormat} disabled={isFormatted} />
          <IconButton
            tooltip="Generate data"
            onClick={handleDeriveData}
            icon={<IconDice5 size={16} />}
          />
          <FileUploadInput onFileLoad={setFile} />
          <CopyButton thing="schema" text={rawSchema} />
        </div>

        <Card.Section sx={{ flex: 1, display: 'flex' }}>
          <CodeEditor
            editorRef={editorRef}
            modelId="schema-panel"
            language={language}
            code={rawSchema}
            onChange={setRawSchema}
            onMarkersValidation={onSchemaMarkersValidation}
            theme={colorScheme === 'dark' ? 'vs-dark' : 'light'}
          />
        </Card.Section>

        <ProblemsPanel errors={errors} onClick={onSchemaProblemClick} />
      </div>
    </Panel>
  );
};

export default SchemaPanel;
