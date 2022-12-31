import Editor from '@monaco-editor/react';
import { type SupportedLanguages } from '@/utils/model';
import type { MutableRefObject } from 'react';
import {
  type ICodeEditor,
  type IMarker,
  type IOptions,
  generateModelUri,
} from '@/utils/monaco';

const defaultOptions: IOptions = {
  minimap: {
    enabled: false,
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
  modelId: string;
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
  modelId,
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
          path={generateModelUri(modelId)}
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
