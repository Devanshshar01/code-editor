import { useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '../../../shared/stores/editorStore';
import { useAutoSave, useKeyboardShortcut } from '../../../shared/hooks';

export function CodeEditor() {
  const { currentFileId, openTabs, updateTabContent, saveFile, theme } = useEditorStore();
  
  const currentTab = openTabs.find((tab) => tab.id === currentFileId);

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

  return (
    <div className="h-full">
      <Editor
        height="100%"
        language={currentTab.language}
        value={currentTab.content}
        onChange={handleEditorChange}
        theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
        options={{
          fontSize: 14,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          formatOnPaste: true,
          formatOnType: true,
          bracketPairColorization: {
            enabled: true,
          },
        }}
        loading={
          <div className="h-full flex items-center justify-center bg-gray-900">
            <div className="text-white">Loading editor...</div>
          </div>
        }
      />
    </div>
  );
}
