import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Play, Terminal as TerminalIcon } from 'lucide-react';
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
    <header className="h-9 bg-[#323233] border-b border-[#1e1e1e] flex items-center justify-between px-2">
      {/* Left section - Menu and Title */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          className="hover:bg-[#2a2d2e] p-1.5"
        >
          {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
        <span className="text-xs text-[#cccccc] font-normal">CodeCollab</span>
      </div>

      {/* Center section - Controls */}
      <div className="flex items-center gap-2">
        {/* Language Selector */}
        <Select
          value={executionLang}
          onChange={(e) => setExecutionLang(e.target.value)}
          options={supportedLanguages.map((lang) => ({
            value: lang,
            label: lang.charAt(0).toUpperCase() + lang.slice(1),
          }))}
          className="text-xs bg-[#3c3c3c] border-[#3c3c3c] hover:bg-[#464647]"
        />

        {/* Run Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={handleRunCode}
          disabled={!currentTab}
          className="flex items-center gap-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-xs px-3 py-1.5"
          title="Run code (Ctrl+Enter)"
        >
          <Play size={14} />
          Run
        </Button>

        {/* Terminal Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTerminal}
          className={`hover:bg-[#2a2d2e] p-1.5 ${isTerminalOpen ? 'bg-[#37373d]' : ''}`}
          aria-label="Toggle terminal"
          title="Toggle terminal"
        >
          <TerminalIcon size={16} />
        </Button>

        {/* Theme Selector */}
        <Select
          value={monacoTheme}
          onChange={(e) => setMonacoTheme(e.target.value)}
          options={MONACO_THEMES}
          className="text-xs bg-[#3c3c3c] border-[#3c3c3c] hover:bg-[#464647] w-36"
          title="Editor theme"
        />

      </div>

      {/* Right section - Theme toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title="Toggle UI theme"
        className="hover:bg-[#2a2d2e] p-1.5"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </Button>
    </header>
  );
}
