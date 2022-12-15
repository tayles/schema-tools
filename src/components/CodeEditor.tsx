import type * as monaco from 'monaco-editor';

import Editor from '@monaco-editor/react';
import { type SupportedLanguages } from '@/utils/model';

const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  minimap: {
    enabled: true,
  },
  links: true,
  automaticLayout: true,
  glyphMargin: false,
  folding: true,
  contextmenu: false,
  cursorBlinking: 'blink',
  copyWithSyntaxHighlighting: false,
  renderFinalNewline: true,
  renderLineHighlight: 'none',
  snippetSuggestions: 'none',
  wordWrap: 'on',
  fixedOverflowWidgets: true,
};

interface Props {
  language: SupportedLanguages;
  code: string;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
  theme?: string;
  onChange?: (value: string) => void;
}

const CodeEditor = ({
  language = 'json',
  code = '',
  options,
  theme = 'vs-light',
  onChange,
}: Props) => {
  const combinedOptions = {
    ...defaultOptions,
    options,
  };

  function handleEditorChange(value: string | undefined) {
    if (onChange) {
      onChange(value ?? '');
    }
  }

  return (
    <Editor
      width="100%"
      height="100%"
      options={combinedOptions}
      language={language}
      value={code ?? undefined}
      theme={theme}
      onChange={handleEditorChange}
    />
  );
};

export default CodeEditor;
