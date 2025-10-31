import { useEffect } from 'react';
import { Header } from './shared/components/organisms/Header';
import { StatusBar } from './shared/components/organisms/StatusBar';
import { TabBar } from './shared/components/organisms/TabBar';
import { Terminal } from './shared/components/organisms/Terminal';
import { HTMLPreview } from './shared/components/organisms/HTMLPreview';
import { FileExplorer } from './features/files/components/FileExplorer';
import { CodeEditor } from './features/editor/components/CodeEditor';
import { ActivityBar } from './shared/components/organisms/ActivityBar';
import { SearchPanel } from './shared/components/organisms/SearchPanel';
import { SourceControlPanel } from './shared/components/organisms/SourceControlPanel';
import { ExtensionsPanel } from './shared/components/organisms/ExtensionsPanel';
import { CommandPalette } from './shared/components/organisms/CommandPalette';
import { useEditorStore } from './shared/stores/editorStore';

function App() {
  const { 
    isSidebarOpen, 
    isPreviewOpen, 
    activeView, 
    setActiveView,
    isCommandPaletteOpen,
    toggleCommandPalette,
    toggleSettings,
    toggleTerminal,
    togglePreview,
    saveFile,
    currentFileId,
  } = useEditorStore();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette: Ctrl/Cmd + Shift + P
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        toggleCommandPalette();
      }
      // Explorer: Ctrl/Cmd + Shift + E
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        setActiveView(activeView === 'explorer' ? null : 'explorer');
      }
      // Search: Ctrl/Cmd + Shift + F
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        setActiveView(activeView === 'search' ? null : 'search');
      }
      // Source Control: Ctrl/Cmd + Shift + G
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        setActiveView(activeView === 'source-control' ? null : 'source-control');
      }
      // Debug: Ctrl/Cmd + Shift + D
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setActiveView(activeView === 'debug' ? null : 'debug');
      }
      // Extensions: Ctrl/Cmd + Shift + X
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'X') {
        e.preventDefault();
        setActiveView(activeView === 'extensions' ? null : 'extensions');
      }
      // Terminal: Ctrl/Cmd + `
      else if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        toggleTerminal();
      }
      // Save: Ctrl/Cmd + S
      else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (currentFileId) {
          saveFile(currentFileId);
        }
      }
      // Settings: Ctrl/Cmd + ,
      else if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        toggleSettings();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView, setActiveView, toggleCommandPalette, toggleTerminal, toggleSettings, togglePreview, saveFile, currentFileId]);

  // Command palette commands
  const commands = [
    {
      id: 'view.terminal',
      title: 'Toggle Terminal',
      category: 'View',
      shortcut: 'Ctrl+`',
      action: toggleTerminal,
    },
    {
      id: 'view.preview',
      title: 'Toggle Preview',
      category: 'View',
      action: togglePreview,
    },
    {
      id: 'view.explorer',
      title: 'Show Explorer',
      category: 'View',
      shortcut: 'Ctrl+Shift+E',
      action: () => setActiveView('explorer'),
    },
    {
      id: 'view.search',
      title: 'Show Search',
      category: 'View',
      shortcut: 'Ctrl+Shift+F',
      action: () => setActiveView('search'),
    },
    {
      id: 'view.scm',
      title: 'Show Source Control',
      category: 'View',
      shortcut: 'Ctrl+Shift+G',
      action: () => setActiveView('source-control'),
    },
    {
      id: 'view.extensions',
      title: 'Show Extensions',
      category: 'View',
      shortcut: 'Ctrl+Shift+X',
      action: () => setActiveView('extensions'),
    },
    {
      id: 'preferences.settings',
      title: 'Preferences: Open Settings',
      shortcut: 'Ctrl+,',
      action: toggleSettings,
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* VS Code Activity Bar */}
        <ActivityBar 
          activeView={activeView}
          onViewChange={setActiveView}
          onSettingsClick={toggleSettings}
        />
        
        {/* Side Panel - Shows different panels based on active view */}
        {isSidebarOpen && activeView && (
          <aside className="flex">
            {activeView === 'explorer' && (
              <div className="w-64 border-r border-[#0000004d]">
                <FileExplorer />
              </div>
            )}
            {activeView === 'search' && (
              <SearchPanel 
                isOpen={true} 
                onClose={() => setActiveView(null)} 
              />
            )}
            {activeView === 'source-control' && (
              <SourceControlPanel 
                isOpen={true} 
                onClose={() => setActiveView(null)} 
              />
            )}
            {activeView === 'extensions' && (
              <ExtensionsPanel 
                isOpen={true} 
                onClose={() => setActiveView(null)} 
              />
            )}
          </aside>
        )}
        
        {/* Main Editor Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <TabBar />
          <div className="flex-1 flex overflow-hidden">
            <div className={`flex flex-col overflow-hidden ${isPreviewOpen ? 'w-1/2' : 'flex-1'}`}>
              <div className="flex-1 overflow-hidden">
                <CodeEditor />
              </div>
              <Terminal />
            </div>
            {isPreviewOpen && (
              <div className="w-1/2 border-l border-[#0000004d]">
                <HTMLPreview />
              </div>
            )}
          </div>
        </main>
      </div>
      
      <StatusBar />
      
      {/* Command Palette Overlay */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={toggleCommandPalette}
        commands={commands}
      />
    </div>
  );
}

export default App;