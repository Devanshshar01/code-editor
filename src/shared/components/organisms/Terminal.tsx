import { X, Terminal as TerminalIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';
import { Button } from '../atoms/Button';

export function Terminal() {
  const { isTerminalOpen, toggleTerminal, executionResult, isExecuting } = useEditorStore();

  if (!isTerminalOpen) return null;

  return (
    <div className="h-64 bg-gray-900 border-t border-gray-700 flex flex-col">
      {/* Terminal Header */}
      <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <TerminalIcon size={16} className="text-green-400" />
          <span className="text-sm font-semibold text-gray-300">Terminal</span>
          {isExecuting && (
            <span className="text-xs text-yellow-400 animate-pulse">Running...</span>
          )}
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
                  <pre className="text-gray-200 whitespace-pre-wrap bg-gray-950 p-2 rounded">
                    {executionResult.run.stdout}
                  </pre>
                </div>
              )}

              {/* Standard Error */}
              {executionResult.run.stderr && (
                <div className="mb-2">
                  <div className="text-xs text-gray-500 mb-1">STDERR:</div>
                  <pre className="text-red-400 whitespace-pre-wrap bg-gray-950 p-2 rounded">
                    {executionResult.run.stderr}
                  </pre>
                </div>
              )}

              {/* Combined Output */}
              {!executionResult.run.stdout && !executionResult.run.stderr && executionResult.run.output && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">OUTPUT:</div>
                  <pre className="text-gray-200 whitespace-pre-wrap bg-gray-950 p-2 rounded">
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
