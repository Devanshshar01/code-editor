import { X } from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';
import { cn } from '../../utils';

export function TabBar() {
  const { openTabs, currentFileId, setCurrentFile, closeTab } = useEditorStore();

  if (openTabs.length === 0) return null;

  return (
    <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center overflow-x-auto">
      {openTabs.map((tab) => (
        <div
          key={tab.id}
          className={cn(
            'h-full flex items-center gap-2 px-4 border-r border-gray-700 cursor-pointer transition-colors',
            currentFileId === tab.id
              ? 'bg-gray-900 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
          )}
          onClick={() => setCurrentFile(tab.id)}
        >
          <span className="text-sm whitespace-nowrap">{tab.fileName}</span>
          {tab.isDirty && <span className="text-yellow-400 text-xs">●</span>}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
            className="ml-2 hover:bg-gray-600 rounded p-0.5 transition-colors"
            aria-label={`Close ${tab.fileName}`}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
