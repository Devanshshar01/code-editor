import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Play, Terminal as TerminalIcon, Eye, Wand2 } from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';
import { executionService } from '../../services/execution.service';
import { Button } from '../atoms/Button';
import { Select } from '../atoms/Select';
import { pythonLintService } from '../../../features/editor/services/pythonLintService';

const MONACO_THEMES = [
  { value: 'vs-dark', label: 'Dark (VS Code)' },
  { value: 'vs-light', label: 'Light (VS Code)' },
  { value: 'hc-black', label: 'High Contrast Dark' },
  { value: 'hc-light', label: 'High Contrast Light' },
  { value: 'python-dark', label: 'Python Dark' },
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
    togglePreview,
    isPreviewOpen,
    currentFileId,
    openTabs,
    setExecutionResult,
    setIsExecuting,
    updateTabContent,
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
      // Ensure terminal is open to show the error
      if (!isTerminalOpen) toggleTerminal();
      
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

  const handleFormatCode = () => {
    if (!currentTab || currentTab.language !== 'python') return;
    
    const formattedCode = pythonLintService.formatPythonCode(currentTab.content);
    updateTabContent(currentTab.id, formattedCode);
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

  // Auto-detect input() in Python code and show terminal with input area
  useEffect(() => {
    if (currentTab && currentTab.language === 'python' && currentTab.content.includes('input(')) {
      // If terminal is already open, we don't need to do anything
      // The user can manually open the input area
    }
  }, [currentTab]);

  return (
    <header className="h-7 bg-[#3c3c3c] border-b border-[#0000004d] flex items-center justify-between px-2 text-[#cccccc] text-xs">
      {/* Left section - Menu and Title */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          className="hover:bg-[#ffffff1a]"
        >
          {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </Button>
        <div className="flex items-center">
          <span className="px-2 py-1 hover:bg-[#ffffff1a] cursor-pointer rounded">File</span>
          <span className="px-2 py-1 hover:bg-[#ffffff1a] cursor-pointer rounded">Edit</span>
          <span className="px-2 py-1 hover:bg-[#ffffff1a] cursor-pointer rounded">View</span>
          <span className="px-2 py-1 hover:bg-[#ffffff1a] cursor-pointer rounded">Run</span>
          <span className="px-2 py-1 hover:bg-[#ffffff1a] cursor-pointer rounded">Terminal</span>
          <span className="px-2 py-1 hover:bg-[#ffffff1a] cursor-pointer rounded">Help</span>
        </div>
      </div>

      {/* Center section - Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <span className="text-xs">CodeCollab - Visual Studio Code Clone</span>
      </div>

      {/* Right section - Controls */}
      <div className="flex items-center gap-2">
        {/* Language Selector */}
        <Select
          value={executionLang}
          onChange={(e) => setExecutionLang(e.target.value)}
          options={supportedLanguages.map((lang) => ({
            value: lang,
            label: lang.charAt(0).toUpperCase() + lang.slice(1),
          }))}
          className="text-xs bg-[#3c3c3c] border-[#0000004d] hover:bg-[#ffffff1a] w-24"
        />

        {/* Run Button */}
        <Button
          variant="success"
          size="sm"
          onClick={handleRunCode}
          disabled={!currentTab}
          className="flex items-center"
          title="Run code (Ctrl+Enter)"
        >
          <Play size={12} />
          <span>Run</span>
        </Button>

        {/* Format Button (Python only) */}
        {currentTab?.language === 'python' && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleFormatCode}
            className="flex items-center"
            title="Format Python code"
          >
            <Wand2 size={12} />
            <span>Format</span>
          </Button>
        )}

        {/* Terminal Toggle */}
        <Button
          variant={isTerminalOpen ? "primary" : "secondary"}
          size="sm"
          onClick={toggleTerminal}
          aria-label="Toggle terminal"
          title="Toggle terminal"
        >
          <TerminalIcon size={12} />
        </Button>

        {/* Preview Toggle */}
        <Button
          variant={isPreviewOpen ? "primary" : "secondary"}
          size="sm"
          onClick={togglePreview}
          aria-label="Toggle preview"
          title="Toggle HTML preview"
        >
          <Eye size={12} />
        </Button>

        {/* Theme Selector */}
        <Select
          value={monacoTheme}
          onChange={(e) => setMonacoTheme(e.target.value)}
          options={MONACO_THEMES}
          className="text-xs bg-[#3c3c3c] border-[#0000004d] hover:bg-[#ffffff1a] w-32"
          title="Editor theme"
        />

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title="Toggle UI theme"
          className="hover:bg-[#ffffff1a]"
        >
          {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
        </Button>
      </div>
    </header>
  );
}