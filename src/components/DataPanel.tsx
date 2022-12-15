import { getFileContents, getFileExtension } from '@/utils/file';
import { useEffect, useState } from 'react';

import CodeEditor from './CodeEditor';
import FileUploadInput from './FileUploadInput';
import Panel from './Panel';
import { type SupportedLanguages } from '@/utils/model';
import { useSchemaStore } from '@/store/state';
import Button from './Button';
import { deriveSchemaFromData } from '@/utils/derive-json-schema';
import { jsonToString, stringToJson } from '@/utils/json';
import ValidLabel from './ValidLabel';
import ErrorCountBadge from './ErrorCountBadge';
import CopyButton from './CopyButton';

const DataPanel = () => {
  const setSchema = useSchemaStore((state) => state.setSchema);
  const setRawSchema = useSchemaStore((state) => state.setRawSchema);
  const data = useSchemaStore((state) => state.data);
  const rawData = useSchemaStore((state) => state.rawData);
  const setDataErrors = useSchemaStore((state) => state.setDataErrors);
  const dataErrors = useSchemaStore((state) => state.dataErrors);
  const setData = useSchemaStore((state) => state.setData);
  const setRawData = useSchemaStore((state) => state.setRawData);
  const isDataValid = useSchemaStore((state) => state.dataValid);

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
    try {
      const data = stringToJson(rawData);
      setData(data);
    } catch (err) {
      console.log('Invalid json', err);
      setDataErrors([
        {
          message: (err as Error).message,
        },
      ]);
    }
  }, [rawData, setData, setDataErrors]);

  const handleDeriveSchema = () => {
    if (!data) {
      return;
    }
    console.time('derive-schema');
    const schema = deriveSchemaFromData(data);
    console.timeEnd('derive-schema');
    setSchema(schema);
    setRawSchema(jsonToString(schema));
  };

  return (
    <Panel title="Data">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <Button onClick={handleDeriveSchema}>Derive Schema</Button>
          <CopyButton text={rawData} />
          <ErrorCountBadge count={dataErrors?.length} />
          <ValidLabel valid={isDataValid} />
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
