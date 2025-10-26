import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Play, Terminal as TerminalIcon, Palette } from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';
import { executionService } from '../../services/execution.service';
import { Button } from '../atoms/Button';
import { Select } from '../atoms/Select';

const MONACO_THEMES = [
  { value: 'vs-dark', label: 'Dark (VS Code)' },
  { value: 'vs-light', label: 'Light (VS Code)' },
  { value: 'hc-black', label: 'High Contrast Dark' },
  { value: 'hc-light', label: 'High Contrast Light' },
];

export function Header() {
  const { 
    isSidebarOpen, 
    theme, 
    monacoTheme,
    toggleSidebar, 
    toggleTheme,
    setMonacoTheme,
    toggleTerminal,
    isTerminalOpen,
    currentFileId,
    openTabs,
    setExecutionResult,
    setIsExecuting,
  } = useEditorStore();

  const [executionLang, setExecutionLang] = useState<string>('python');
  const currentTab = openTabs.find((tab) => tab.id === currentFileId);
  const supportedLanguages = executionService.getSupportedLanguages();

  const handleRunCode = async () => {
    if (!currentTab) return;

    const langToUse = executionService.isLanguageSupported(currentTab.language)
      ? currentTab.language
      : executionLang;

    try {
      setIsExecuting(true);
      setExecutionResult(null);
      if (!isTerminalOpen) toggleTerminal();

      const result = await executionService.executeCode(currentTab.content, langToUse);
      setExecutionResult(result);
    } catch (error) {
      console.error('Execution error:', error);
      setExecutionResult({
        language: langToUse,
        version: '0.0.0',
        run: {
          stdout: '',
          stderr: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 1,
          signal: null,
          output: '',
        },
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Ctrl+Enter keyboard shortcut for running code
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        handleRunCode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTab, executionLang, isTerminalOpen]);

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

      <div className="flex items-center gap-3">
        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400">Language:</label>
          <Select
            value={executionLang}
            onChange={(e) => setExecutionLang(e.target.value)}
            options={supportedLanguages.map((lang) => ({
              value: lang,
              label: lang.charAt(0).toUpperCase() + lang.slice(1),
            }))}
            className="text-xs"
          />
        </div>

        {/* Run Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={handleRunCode}
          disabled={!currentTab}
          className="flex items-center gap-2"
          title="Run code (Ctrl+Enter)"
        >
          <Play size={16} />
          Run Code
        </Button>

        {/* Terminal Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTerminal}
          className={isTerminalOpen ? 'bg-gray-700' : ''}
          aria-label="Toggle terminal"
          title="Toggle terminal"
        >
          <TerminalIcon size={20} />
        </Button>

        {/* Theme Selector */}
        <div className="flex items-center gap-2">
          <Palette size={16} className="text-gray-400" />
          <Select
            value={monacoTheme}
            onChange={(e) => setMonacoTheme(e.target.value)}
            options={MONACO_THEMES}
            className="text-xs w-40"
            title="Editor theme"
          />
        </div>

        {/* Dark/Light Mode Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title="Toggle UI theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </div>
    </header>
  );
}
