import { useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '../../../shared/stores/editorStore';
import { useAutoSave, useKeyboardShortcut } from '../../../shared/hooks';
import { configurePythonLanguage } from '../utils/pythonConfig';
import { pythonLanguageService } from '../services/pythonLanguageService';
import { enhancePythonSyntaxHighlighting } from '../themes/pythonTheme';
import { pythonLintService } from '../services/pythonLintService';
import * as monaco from 'monaco-editor';

export function CodeEditor() {
  const { currentFileId, openTabs, updateTabContent, saveFile, monacoTheme } = useEditorStore();
  
  const currentTab = openTabs.find((tab) => tab.id === currentFileId);

  // Configure Python language features when component mounts
  useEffect(() => {
    configurePythonLanguage();
    pythonLanguageService;
    enhancePythonSyntaxHighlighting();
  }, []);

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined && currentFileId) {
        updateTabContent(currentFileId, value);
      }
    },
    [currentFileId, updateTabContent]
  );

  const handleSave = useCallback(() => {
    if (currentFileId) {
      saveFile(currentFileId);
    }
  }, [currentFileId, saveFile]);

  // Auto-save after 3 seconds of inactivity
  useAutoSave(currentTab?.content || '', handleSave, 3000);

  // Ctrl+S / Cmd+S to save manually
  useKeyboardShortcut('s', handleSave, { ctrl: true });

  if (!currentTab) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 text-gray-400">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">No File Open</h2>
          <p>Select a file from the explorer to start editing</p>
        </div>
      </div>
    );
  }

  // Python-specific editor options
  const pythonOptions: monaco.editor.IStandaloneEditorConstructionOptions = currentTab.language === 'python' ? {
    fontSize: 14,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    wordWrap: 'on' as const,
    automaticLayout: true,
    tabSize: 4,
    insertSpaces: true,
    formatOnPaste: true,
    formatOnType: true,
    bracketPairColorization: {
      enabled: true,
    },
    suggest: {
      showKeywords: true,
      showSnippets: true,
      showClasses: true,
      showFunctions: true,
      showVariables: true,
      showModules: true,
    },
    quickSuggestions: {
      other: true,
      comments: false,
      strings: true
    },
    parameterHints: {
      enabled: true
    },
    wordBasedSuggestions: 'allDocuments',
    suggestSelection: 'first',
    suggestFontSize: 14,
    suggestLineHeight: 20,
  } : {
    fontSize: 14,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    wordWrap: 'on' as const,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    formatOnPaste: true,
    formatOnType: true,
    bracketPairColorization: {
      enabled: true,
    },
  };

  // Handle editor mount to set up language service
  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    if (currentTab.language === 'python') {
      // Set up validation for Python code
      const model = editor.getModel();
      if (model) {
        // Validate code when content changes
        const disposable = model.onDidChangeContent(() => {
          pythonLanguageService.validatePythonCode(model);
          // Also run linting
          const markers = pythonLintService.lintPythonCode(model);
          pythonLintService.setMarkers(model, markers);
        });
        
        // Initial validation
        pythonLanguageService.validatePythonCode(model);
        const markers = pythonLintService.lintPythonCode(model);
        pythonLintService.setMarkers(model, markers);
        
        // Clean up listener
        return () => disposable.dispose();
      }
    }
  };

  return (
    <div className="h-full">
      <Editor
        height="100%"
        language={currentTab.language}
        value={currentTab.content}
        onChange={handleEditorChange}
        theme={currentTab.language === 'python' ? 'python-dark' : monacoTheme}
        options={pythonOptions}
        onMount={handleEditorDidMount}
        loading={
          <div className="h-full flex items-center justify-center bg-gray-900">
            <div className="text-white">Loading editor...</div>
          </div>
        }
      />
    </div>
  );
}