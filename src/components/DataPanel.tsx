import { getFileContents, getFileExtension } from '@/utils/file';
import { useEffect, useState } from 'react';

import CodeEditor from './CodeEditor';
import FileUploadInput from './FileUploadInput';
import Panel from './Panel';
import { type SupportedLanguages } from '@/utils/model';
import { useSchemaStore } from '@/store/state';
import { useCopyToClipboard } from 'usehooks-ts';
import Button from './Button';

const DataPanel = () => {
  const rawData = useSchemaStore((state) => state.rawData);
  const setRawData = useSchemaStore((state) => state.setRawData);
  const [, copy] = useCopyToClipboard();

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

  return (
    <Panel title="Data">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex gap-2">
          <Button onClick={() => copy(rawData)}>Copy</Button>
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
