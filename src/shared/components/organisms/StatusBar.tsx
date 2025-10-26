import { useEditorStore } from '../../stores/editorStore';

export function StatusBar() {
  const { currentFileId, openTabs } = useEditorStore();
  const currentTab = openTabs.find((tab) => tab.id === currentFileId);

  return (
    <footer className="h-6 bg-[#007acc] text-white text-xs flex items-center justify-between px-3">
      <div className="flex items-center gap-4">
        {currentTab ? (
          <>
            <span className="font-medium">{currentTab.language.toUpperCase()}</span>
            <span className="opacity-90">{currentTab.fileName}</span>
            {currentTab.isDirty && <span className="opacity-90">● Modified</span>}
          </>
        ) : (
          <span>No file selected</span>
        )}
      </div>
      <div className="flex items-center gap-4 opacity-90">
        <span>{openTabs.length} files</span>
      </div>
    </footer>
  );
}
