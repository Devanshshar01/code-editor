import { useEffect, useRef, useState } from 'react';
import { X, RefreshCw, Eye } from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';
import { Button } from '../atoms/Button';

export function HTMLPreview() {
  const { isPreviewOpen, togglePreview, currentFileId, openTabs } = useEditorStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  const currentTab = openTabs.find((tab) => tab.id === currentFileId);
  const isHTMLFile = currentTab?.language === 'html' || currentTab?.fileName.endsWith('.html');

  useEffect(() => {
    if (!iframeRef.current || !isPreviewOpen || !currentTab) return;

    // Debounce preview updates
    const timeoutId = setTimeout(() => {
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        
        if (doc) {
          doc.open();
          doc.write(currentTab.content);
          doc.close();
          setLastUpdate(Date.now());
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [currentTab?.content, isPreviewOpen]);

  const handleRefresh = () => {
    if (iframeRef.current && currentTab) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        doc.open();
        doc.write(currentTab.content);
        doc.close();
        setLastUpdate(Date.now());
      }
    }
  };

  if (!isPreviewOpen) return null;

  return (
    <div className="h-full bg-[#1e1e1e] border-l border-[#2d2d2d] flex flex-col">
      {/* Preview Header */}
      <div className="h-10 bg-[#252526] border-b border-[#2d2d2d] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Eye size={16} className="text-[#007acc]" />
          <span className="text-sm font-semibold text-[#cccccc]">Live Preview</span>
          {isHTMLFile && (
            <span className="text-xs text-[#6a9955]">● Auto-updating</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="p-1.5 hover:bg-[#2a2d2e]"
            title="Refresh preview"
          >
            <RefreshCw size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePreview}
            className="p-1"
            aria-label="Close preview"
          >
            <X size={16} />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden bg-white">
        {!isHTMLFile ? (
          <div className="h-full flex items-center justify-center text-gray-600">
            <div className="text-center">
              <Eye size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">HTML Preview</p>
              <p className="text-sm mt-2">Open an HTML file to see live preview</p>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            title="HTML Preview"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        )}
      </div>

      {/* Preview Footer */}
      {isHTMLFile && (
        <div className="h-6 bg-[#007acc] text-white text-xs flex items-center justify-between px-3">
          <span>Preview Mode</span>
          <span>Last updated: {new Date(lastUpdate).toLocaleTimeString()}</span>
        </div>
      )}
    </div>
  );
}
