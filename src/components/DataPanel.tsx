import CodeEditor, { type SupportedLanguages } from './CodeEditor';
import { useEffect, useState } from 'react';

import FileUploadInput from './FileUploadInput';
import Panel from './Panel';
import { getFileContents, getFileExtension } from '@/utils/file';

const DataPanel = () => {
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

  return (
    <Panel title="Data">
      <FileUploadInput onFileLoad={setFile} />
      <div className="flex-1">
        <CodeEditor language={language} code={value} />
      </div>
    </Panel>
  );
};

export default DataPanel;
