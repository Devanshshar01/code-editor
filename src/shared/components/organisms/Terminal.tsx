import { useState } from 'react';
import { X, Terminal as TerminalIcon, AlertCircle, CheckCircle, Play } from 'lucide-react';
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
  const currentTab = openTabs.find((tab) => tab.id === currentFileId);

  const handleRunWithInput = async () => {
    if (!currentTab) return;

    const langToUse = executionService.isLanguageSupported(currentTab.language)
      ? currentTab.language
      : 'python';

    try {
      setIsExecuting(true);
      setExecutionResult(null);

      const result = await executionService.executeCode(
        currentTab.content,
        langToUse,
        stdinInput
      );
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

  if (!isTerminalOpen) return null;

  return (
    <div className="h-64 bg-[#1e1e1e] border-t border-[#2d2d2d] flex flex-col">
      {/* Terminal Header */}
      <div className="h-10 bg-[#252526] border-b border-[#2d2d2d] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <TerminalIcon size={16} className="text-green-400" />
          <span className="text-sm font-semibold text-gray-300">Terminal</span>
          {isExecuting && (
            <span className="text-xs text-yellow-400 animate-pulse">Running...</span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInputArea(!showInputArea)}
            className="text-xs"
            title="Provide input (stdin)"
          >
            {showInputArea ? 'Hide Input' : 'Add Input'}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTerminal}
          className="p-1"
          aria-label="Close terminal"
        >
          <X size={16} />
        </Button>
      </div>

      {/* Input Area */}
      {showInputArea && (
        <div className="bg-[#2d2d2d] border-b border-[#3e3e42] p-3">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400">Program Input (stdin):</label>
            <textarea
              value={stdinInput}
              onChange={(e) => setStdinInput(e.target.value)}
              placeholder="Enter input for your program (one value per line)..."
              className="bg-[#1e1e1e] text-[#cccccc] text-sm p-2 rounded border border-[#3e3e42] focus:border-[#007acc] focus:outline-none font-mono"
              rows={4}
            />
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleRunWithInput}
                disabled={!currentTab || isExecuting}
                className="flex items-center gap-2"
              >
                <Play size={14} />
                Run with Input
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStdinInput('')}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Content */}
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {!executionResult && !isExecuting && (
          <div className="text-gray-500 flex items-center gap-2">
            <TerminalIcon size={16} />
            <span>Click "Run Code" to execute your program</span>
          </div>
        )}

        {isExecuting && (
          <div className="text-yellow-400 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-400 border-t-transparent"></div>
            <span>Executing code...</span>
          </div>
        )}

        {executionResult && !isExecuting && (
          <div className="space-y-3">
            {/* Compilation Output */}
            {executionResult.compile && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {executionResult.compile.code === 0 ? (
                    <CheckCircle size={16} className="text-green-400" />
                  ) : (
                    <AlertCircle size={16} className="text-red-400" />
                  )}
                  <span className="text-gray-400 font-semibold">
                    Compilation {executionResult.compile.code === 0 ? 'Success' : 'Failed'}
                  </span>
                </div>
                {executionResult.compile.stdout && (
                  <pre className="text-green-400 whitespace-pre-wrap">
                    {executionResult.compile.stdout}
                  </pre>
                )}
                {executionResult.compile.stderr && (
                  <pre className="text-red-400 whitespace-pre-wrap">
                    {executionResult.compile.stderr}
                  </pre>
                )}
              </div>
            )}

            {/* Execution Output */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {executionResult.run.code === 0 ? (
                  <CheckCircle size={16} className="text-green-400" />
                ) : (
                  <AlertCircle size={16} className="text-red-400" />
                )}
                <span className="text-gray-400 font-semibold">
                  Execution {executionResult.run.code === 0 ? 'Success' : 'Failed'} (Exit code: {executionResult.run.code})
                </span>
              </div>

              {/* Standard Output */}
              {executionResult.run.stdout && (
                <div className="mb-2">
                  <div className="text-xs text-gray-500 mb-1">STDOUT:</div>
                  <pre className="text-[#cccccc] whitespace-pre-wrap bg-[#1e1e1e] p-2 rounded">
                    {executionResult.run.stdout}
                  </pre>
                </div>
              )}

              {/* Standard Error */}
              {executionResult.run.stderr && (
                <div className="mb-2">
                  <div className="text-xs text-gray-500 mb-1">STDERR:</div>
                  <pre className="text-[#f48771] whitespace-pre-wrap bg-[#1e1e1e] p-2 rounded">
                    {executionResult.run.stderr}
                  </pre>
                </div>
              )}

              {/* Combined Output */}
              {!executionResult.run.stdout && !executionResult.run.stderr && executionResult.run.output && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">OUTPUT:</div>
                  <pre className="text-[#cccccc] whitespace-pre-wrap bg-[#1e1e1e] p-2 rounded">
                    {executionResult.run.output}
                  </pre>
                </div>
              )}

              {/* No output message */}
              {!executionResult.run.stdout && !executionResult.run.stderr && !executionResult.run.output && (
                <div className="text-gray-500 italic">No output produced</div>
              )}
            </div>

            {/* Language Info */}
            <div className="text-xs text-gray-600 border-t border-gray-800 pt-2 mt-2">
              Language: {executionResult.language} {executionResult.version}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
