import { Header } from './shared/components/organisms/Header';
import { StatusBar } from './shared/components/organisms/StatusBar';
import { TabBar } from './shared/components/organisms/TabBar';
import { Terminal } from './shared/components/organisms/Terminal';
import { HTMLPreview } from './shared/components/organisms/HTMLPreview';
import { FileExplorer } from './features/files/components/FileExplorer';
import { CodeEditor } from './features/editor/components/CodeEditor';
import { useEditorStore } from './shared/stores/editorStore';

function App() {
  const { isSidebarOpen, isPreviewOpen } = useEditorStore();

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {isSidebarOpen && (
          <aside className="w-60 border-r border-[#2d2d2d]">
            <FileExplorer />
          </aside>
        )}
        
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
              <div className="w-1/2">
                <HTMLPreview />
              </div>
            )}
          </div>
        </main>
      </div>
      
      <StatusBar />
    </div>
  );
}

export default App;
