import Editor from '@monaco-editor/react';
import { type SupportedLanguages } from '@/utils/model';
import type { MutableRefObject } from 'react';
import type { ICodeEditor, IMarker, IOptions } from '@/utils/monaco';

const defaultOptions: IOptions = {
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
  editorRef: MutableRefObject<ICodeEditor>;
  language: SupportedLanguages;
  code: string;
  options?: IOptions;
  theme?: string;
  onChange?: (value: string) => void;
  onMarkersValidation?: (markers: IMarker[]) => void;
  onMount?: (editor: ICodeEditor) => void;
}

const CodeEditor = ({
  editorRef,
  language = 'json',
  code = '',
  options,
  theme = 'vs-light',
  onMount,
  onChange,
  onMarkersValidation,
}: Props) => {
  const combinedOptions = {
    ...defaultOptions,
    options,
  };

  function handleEditorDidMount(editor: ICodeEditor) {
    editorRef.current = editor;
    if (onMount) onMount(editor);
  }

  function handleEditorChange(value: string | undefined) {
    if (onChange) onChange(value ?? '');
  }

  function handleEditorValidation(markers: IMarker[]) {
    if (onMarkersValidation) onMarkersValidation(markers);
  }

  return (
    <div className="relative flex-1">
      <div className="absolute inset-0">
        <Editor
          width="100%"
          height="100%"
          options={combinedOptions}
          language={language}
          value={code ?? undefined}
          theme={theme}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          onValidate={handleEditorValidation}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
