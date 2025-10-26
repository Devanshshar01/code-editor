import { useEditorStore } from '../../stores/editorStore';

export function StatusBar() {
  const { currentFileId, openTabs } = useEditorStore();
  const currentTab = openTabs.find((tab) => tab.id === currentFileId);

  return (
    <footer className="h-5 bg-[#007acc] text-white text-xs flex items-center justify-between px-2">
      <div className="flex items-center gap-3">
        {currentTab ? (
          <>
            <span className="flex items-center gap-1">
              <span className="bg-[#ffffff26] px-1 py-0.5 rounded">Spaces: 2</span>
            </span>
            <span className="opacity-90">{currentTab.fileName}</span>
            {currentTab.isDirty && <span className="opacity-90">● Modified</span>}
          </>
        ) : (
          <span>No file selected</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="bg-[#ffffff26] px-1 py-0.5 rounded">UTF-8</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="bg-[#ffffff26] px-1 py-0.5 rounded">LF</span>
        </span>
        {currentTab && (
          <span className="flex items-center gap-1">
            <span className="bg-[#ffffff26] px-1 py-0.5 rounded">Python</span>
          </span>
        )}
        <span>{openTabs.length} files</span>
      </div>
    </footer>
  );
}