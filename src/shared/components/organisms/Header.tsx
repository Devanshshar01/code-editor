import { Menu, X, Moon, Sun } from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';
import { Button } from '../atoms/Button';

export function Header() {
  const { isSidebarOpen, theme, toggleSidebar, toggleTheme } = useEditorStore();

  return (
    <header className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
        <h1 className="text-lg font-semibold text-white">CodeCollab</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </div>
    </header>
  );
}
