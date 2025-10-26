import { useState } from 'react';
import { X, Terminal as TerminalIcon, AlertCircle, CheckCircle, Play, Package } from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';
import { executionService } from '../../services/execution.service';
import { Button } from '../atoms/Button';

export function Terminal() {
  const { 
    isTerminalOpen, 
    toggleTerminal, 
    executionResult, 
    isExecuting,
    currentFileId,
    openTabs,
    setExecutionResult,
    setIsExecuting,
  } = useEditorStore();

  const [stdinInput, setStdinInput] = useState('');
  const [showInputArea, setShowInputArea] = useState(false);
  const [showPackages, setShowPackages] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const currentTab = openTabs.find((tab) => tab.id === currentFileId);

  // Python-specific packages
  const pythonPackages = [
    'math', 'random', 'datetime', 'json', 'os', 'sys', 'collections', 
    'itertools', 'functools', 're', 'urllib', 'requests', 'numpy', 
    'pandas', 'matplotlib', 'scipy', 'sklearn'
  ];

  const handleRunWithInput = async () => {
    if (!currentTab) return;

    const langToUse = executionService.isLanguageSupported(currentTab.language)
      ? currentTab.language
      : 'python';

    try {
      setIsExecuting(true);
      setExecutionResult(null);

      let result;
      if (langToUse === 'python' && selectedPackages.length > 0) {
        // Use enhanced Python execution with packages
        result = await executionService.executePythonWithPackages(
          currentTab.content,
          selectedPackages,
          stdinInput
        );
      } else {
        // Standard execution
        result = await executionService.executeCode(
          currentTab.content,
          langToUse,
          stdinInput
        );
      }
      
      setExecutionResult(result);
      setShowInputArea(false);
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

  const togglePackage = (pkg: string) => {
    setSelectedPackages(prev => 
      prev.includes(pkg) 
        ? prev.filter(p => p !== pkg) 
        : [...prev, pkg]
    );
  };

  // Auto-detect if the code contains input() function and show input area
  // const handleAutoShowInput = () => {
  //   if (currentTab && currentTab.content.includes('input(')) {
  //     setShowInputArea(true);
  //   }
  // };

  if (!isTerminalOpen) return null;

  return (
    <div className="h-48 bg-[#1e1e1e] border-t border-[#0000004d] flex flex-col">
      {/* Terminal Header */}
      <div className="h-6 bg-[#252526] border-b border-[#0000004d] flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <TerminalIcon size={12} className="text-green-400" />
          <span className="text-xs font-semibold text-gray-300">Terminal</span>
          {isExecuting && (
            <span className="text-xs text-yellow-400 animate-pulse">Running...</span>
          )}
          <Button
            variant="secondary"
            size="xs"
            onClick={() => setShowInputArea(!showInputArea)}
            title="Provide input (stdin)"
          >
            {showInputArea ? 'Hide Input' : 'Add Input'}
          </Button>
          {currentTab?.language === 'python' && (
            <Button
              variant="secondary"
              size="xs"
              onClick={() => setShowPackages(!showPackages)}
              className="flex items-center"
              title="Add Python packages"
            >
              <Package size={10} />
              <span>{showPackages ? 'Hide Packages' : 'Add Packages'}</span>
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="xs"
          onClick={toggleTerminal}
          aria-label="Close terminal"
          className="hover:bg-[#ffffff1a]"
        >
          <X size={12} />
        </Button>
      </div>

      {/* Python Packages Area */}
      {currentTab?.language === 'python' && showPackages && (
        <div className="bg-[#2d2d2d] border-b border-[#0000004d] p-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Select Python packages to import:</label>
            <div className="flex flex-wrap gap-1">
              {pythonPackages.map(pkg => (
                <button
                  key={pkg}
                  onClick={() => togglePackage(pkg)}
                  className={`px-1.5 py-0.5 text-xs rounded transition-all duration-200 ${
                    selectedPackages.includes(pkg)
                      ? 'bg-blue-600 text-white shadow-[0_2px_4px_rgba(0,0,0,0.2)]'
                      : 'bg-[#1e1e1e] text-gray-300 hover:bg-[#3e3e42] shadow-[0_1px_2px_rgba(0,0,0,0.1)]'
                  }`}
                >
                  {pkg}
                </button>
              ))}
            </div>
            {selectedPackages.length > 0 && (
              <div className="text-xs text-gray-400 mt-1">
                Selected: {selectedPackages.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input Area */}
      {showInputArea && (
        <div className="bg-[#2d2d2d] border-b border-[#0000004d] p-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Program Input (stdin):</label>
            <textarea
              value={stdinInput}
              onChange={(e) => setStdinInput(e.target.value)}
              placeholder="Enter input for your program (one value per line)..."
              className="bg-[#1e1e1e] text-[#cccccc] text-xs p-1 rounded border border-[#0000004d] focus:border-[#007acc] focus:outline-none font-mono"
              rows={2}
            />
            <div className="text-xs text-gray-500">
              Note: For multiple inputs, separate them with newlines
            </div>
            <div className="flex gap-1">
              <Button
                variant="success"
                size="xs"
                onClick={handleRunWithInput}
                disabled={!currentTab || isExecuting}
                className="flex items-center"
              >
                <Play size={10} />
                <span>Run with Input</span>
              </Button>
              <Button
                variant="secondary"
                size="xs"
                onClick={() => setStdinInput('')}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Content */}
      <div className="flex-1 overflow-auto p-2 font-mono text-xs">
        {!executionResult && !isExecuting && (
          <div className="text-gray-500 flex items-center gap-1">
            <TerminalIcon size={12} />
            <span>Click "Run Code" to execute your program</span>
          </div>
        )}

        {isExecuting && (
          <div className="text-yellow-400 flex items-center gap-1">
            <div className="animate-spin rounded-full h-3 w-3 border border-yellow-400 border-t-transparent"></div>
            <span>Executing code...</span>
          </div>
        )}

        {executionResult && !isExecuting && (
          <div className="space-y-2">
            {/* Compilation Output */}
            {executionResult.compile && (
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {executionResult.compile.code === 0 ? (
                    <CheckCircle size={12} className="text-green-400" />
                  ) : (
                    <AlertCircle size={12} className="text-red-400" />
                  )}
                  <span className="text-gray-400 font-semibold">
                    Compilation {executionResult.compile.code === 0 ? 'Success' : 'Failed'}
                  </span>
                </div>
                {executionResult.compile.stdout && (
                  <pre className="text-green-400 whitespace-pre-wrap text-xs">
                    {executionResult.compile.stdout}
                  </pre>
                )}
                {executionResult.compile.stderr && (
                  <pre className="text-red-400 whitespace-pre-wrap text-xs">
                    {executionResult.compile.stderr}
                  </pre>
                )}
              </div>
            )}

            {/* Execution Output */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                {executionResult.run.code === 0 ? (
                  <CheckCircle size={12} className="text-green-400" />
                ) : (
                  <AlertCircle size={12} className="text-red-400" />
                )}
                <span className="text-gray-400 font-semibold">
                  Execution {executionResult.run.code === 0 ? 'Success' : 'Failed'} (Exit code: {executionResult.run.code})
                </span>
              </div>

              {/* Standard Output */}
              {executionResult.run.stdout && (
                <div className="mb-1">
                  <div className="text-xs text-gray-500 mb-0.5">STDOUT:</div>
                  <pre className="text-[#cccccc] whitespace-pre-wrap bg-[#1e1e1e] p-1 rounded text-xs">
                    {executionResult.run.stdout}
                  </pre>
                </div>
              )}

              {/* Standard Error */}
              {executionResult.run.stderr && (
                <div className="mb-1">
                  <div className="text-xs text-gray-500 mb-0.5">STDERR:</div>
                  <pre className="text-[#f48771] whitespace-pre-wrap bg-[#1e1e1e] p-1 rounded text-xs">
                    {executionResult.run.stderr}
                  </pre>
                </div>
              )}

              {/* Combined Output */}
              {!executionResult.run.stdout && !executionResult.run.stderr && executionResult.run.output && (
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">OUTPUT:</div>
                  <pre className="text-[#cccccc] whitespace-pre-wrap bg-[#1e1e1e] p-1 rounded text-xs">
                    {executionResult.run.output}
                  </pre>
                </div>
              )}

              {/* No output message */}
              {!executionResult.run.stdout && !executionResult.run.stderr && !executionResult.run.output && (
                <div className="text-gray-500 italic text-xs">No output produced</div>
              )}
            </div>

            {/* Language Info */}
            <div className="text-xs text-gray-600 border-t border-gray-800 pt-1 mt-1">
              Language: {executionResult.language} {executionResult.version}
              {currentTab?.language === 'python' && selectedPackages.length > 0 && (
                <div className="mt-0.5">Packages: {selectedPackages.join(', ')}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}