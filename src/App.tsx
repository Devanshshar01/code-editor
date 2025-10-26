import { Header } from './shared/components/organisms/Header';
import { StatusBar } from './shared/components/organisms/StatusBar';
import { TabBar } from './shared/components/organisms/TabBar';
import { FileExplorer } from './features/files/components/FileExplorer';
import { CodeEditor } from './features/editor/components/CodeEditor';
import { useEditorStore } from './shared/stores/editorStore';

function App() {
  const { isSidebarOpen } = useEditorStore();

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {isSidebarOpen && (
          <aside className="w-64 border-r border-gray-700">
            <FileExplorer />
          </aside>
        )}
        
        <main className="flex-1 flex flex-col">
          <TabBar />
          <div className="flex-1 overflow-hidden">
            <CodeEditor />
          </div>
        </main>
      </div>
      
      <StatusBar />
    </div>
  );
}

export default App;
