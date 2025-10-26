import { useEditorStore } from '../../stores/editorStore';

export function StatusBar() {
  const { currentFileId, openTabs } = useEditorStore();
  const currentTab = openTabs.find((tab) => tab.id === currentFileId);

  return (
    <footer className="h-6 bg-blue-600 text-white text-xs flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        {currentTab ? (
          <>
            <span>{currentTab.fileName}</span>
            <span className="text-blue-200">{currentTab.language}</span>
            {currentTab.isDirty && <span className="text-yellow-300">● Unsaved</span>}
          </>
        ) : (
          <span>No file open</span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span>{openTabs.length} files open</span>
      </div>
    </footer>
  );
}
