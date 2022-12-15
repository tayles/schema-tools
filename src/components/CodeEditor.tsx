import type * as monaco from 'monaco-editor';

import Editor from '@monaco-editor/react';

export type SupportedLanguages = 'json' | 'yaml';

const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  acceptSuggestionOnCommitCharacter: true,
  acceptSuggestionOnEnter: 'on',
  accessibilitySupport: 'auto',
  // autoIndent: false,
  automaticLayout: true,
  codeLens: true,
  colorDecorators: true,
  contextmenu: true,
  cursorBlinking: 'blink',
  cursorSmoothCaretAnimation: false,
  cursorStyle: 'line',
  disableLayerHinting: false,
  disableMonospaceOptimizations: false,
  dragAndDrop: false,
  fixedOverflowWidgets: false,
  folding: true,
  foldingStrategy: 'auto',
  fontLigatures: false,
  formatOnPaste: false,
  formatOnType: false,
  hideCursorInOverviewRuler: false,
  // highlightActiveIndentGuide: true,
  links: true,
  mouseWheelZoom: false,
  multiCursorMergeOverlapping: true,
  multiCursorModifier: 'alt',
  overviewRulerBorder: true,
  overviewRulerLanes: 2,
  quickSuggestions: true,
  quickSuggestionsDelay: 100,
  readOnly: false,
  renderControlCharacters: false,
  renderFinalNewline: true,
  // renderIndentGuides: true,
  renderLineHighlight: 'all',
  renderWhitespace: 'none',
  revealHorizontalRightPadding: 30,
  roundedSelection: true,
  rulers: [],
  scrollBeyondLastColumn: 5,
  scrollBeyondLastLine: true,
  selectOnLineNumbers: true,
  selectionClipboard: true,
  selectionHighlight: true,
  showFoldingControls: 'mouseover',
  smoothScrolling: false,
  suggestOnTriggerCharacters: true,
  wordBasedSuggestions: true,
  wordSeparators: '~!@#$%^&*()-=+[{]}|;:\'",.<>/?',
  wordWrap: 'off',
  wordWrapBreakAfterCharacters: '\t})]?|&,;',
  wordWrapBreakBeforeCharacters: '{([+',
  // wordWrapBreakObtrusiveCharacters: '.',
  wordWrapColumn: 80,
  // wordWrapMinified: true,
  wrappingIndent: 'none',
};

interface Props {
  language?: SupportedLanguages;
  code?: string;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
  theme?: string;
}

const CodeEditor = ({
  language = 'json',
  code = '',
  options,
  theme = 'vs-light',
}: Props) => {
  const combinedOptions = {
    ...defaultOptions,
    options,
  };

  return (
    <Editor
      width="100%"
      height="100%"
      options={combinedOptions}
      language={language}
      value={code}
      theme={theme}
    />
  );
};

export default CodeEditor;