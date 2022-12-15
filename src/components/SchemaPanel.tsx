import CodeEditor, { type SupportedLanguages } from './CodeEditor';
import { useEffect, useState } from 'react';

import FileUploadInput from './FileUploadInput';
import Panel from './Panel';

const SchemaPanel = () => {
  const [file, setFile] = useState<File>();
  const [value, setValue] = useState('');
  const [language, setLanguage] = useState<SupportedLanguages>('json');

  useEffect(() => {
    if (file) {
      const extension = file.name.split('.').pop();
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

      const reader = new FileReader();
      reader.onload = async (e) => {
        if (typeof e.target?.result === 'string') {
          setValue(e.target.result);
        } else {
          throw new Error('Cannot read file contents');
        }
      };
      reader.readAsText(file);
    }
  }, [file]);

  return (
    <Panel title="Schema">
      <FileUploadInput onFileLoad={setFile} />
      <div className="flex-1">
        <CodeEditor language={language} code={value} />
      </div>
    </Panel>
  );
};

export default SchemaPanel;
