import { X } from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';
import { cn } from '../../utils';

export function TabBar() {
  const { openTabs, currentFileId, setCurrentFile, closeTab } = useEditorStore();

  if (openTabs.length === 0) return null;

  return (
    <div className="h-7 bg-[#252526] border-b border-[#1e1e1e] flex items-center overflow-x-auto">
      {openTabs.map((tab) => (
        <div
          key={tab.id}
          className={cn(
            'h-full flex items-center gap-2 px-3 cursor-pointer transition-colors group relative',
            currentFileId === tab.id
              ? 'bg-[#1e1e1e] text-white'
              : 'bg-[#2d2d2d] text-[#969696] hover:bg-[#2a2a2b]'
          )}
          onClick={() => setCurrentFile(tab.id)}
          style={{ 
            borderRight: '1px solid #1e1e1e',
            borderTop: currentFileId === tab.id ? '1px solid #007acc' : '1px solid transparent'
          }}
        >
          <span className="text-xs whitespace-nowrap">{tab.fileName}</span>
          {tab.isDirty && <span className="text-white text-[10px]">●</span>}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
            className="ml-1 hover:bg-[#3e3e42] rounded p-0.5 transition-colors opacity-0 group-hover:opacity-100"
            aria-label={`Close ${tab.fileName}`}
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}