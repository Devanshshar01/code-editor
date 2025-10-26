import { useState, useEffect } from 'react';
import { Play, Pause, Square, Circle, CircleOff } from 'lucide-react';
import { pythonDebugService } from '../services/pythonDebugService';
import { Button } from '../../../shared/components/atoms/Button';

interface DebugPanelProps {
  code: string;
  currentLine: number | null;
  onLineChange: (lineNumber: number | null) => void;
}

export function DebugPanel({ code, onLineChange }: DebugPanelProps) {
  const [debugState, setDebugState] = useState(pythonDebugService.getDebugState());
  const [expression, setExpression] = useState('');
  const [evalResult, setEvalResult] = useState('');

  useEffect(() => {
    const handleStateChange = (state: any) => {
      setDebugState({ ...state });
      onLineChange(state.currentLine);
    };
    
    pythonDebugService.onStateChange(handleStateChange);

    return () => {
      // In a real implementation, we would unsubscribe here
      // For now, we'll just leave it as is
    };
  }, [onLineChange]);

  const handleStartDebugging = async () => {
    await pythonDebugService.startDebugging(code);
  };

  const handleStopDebugging = () => {
    pythonDebugService.stopDebugging();
  };

  const handleStepOver = () => {
    pythonDebugService.stepOver();
  };

  const handleStepInto = () => {
    pythonDebugService.stepInto();
  };

  const handleStepOut = () => {
    pythonDebugService.stepOut();
  };

  const handleContinue = () => {
    pythonDebugService.continueExecution();
  };

  const handleToggleBreakpoint = (lineNumber: number) => {
    if (pythonDebugService.hasBreakpointAt(lineNumber)) {
      pythonDebugService.removeBreakpoint(lineNumber);
    } else {
      pythonDebugService.setBreakpoint(lineNumber);
    }
  };

  const handleEvaluate = async () => {
    if (expression.trim()) {
      const result = await pythonDebugService.evaluateExpression(expression);
      setEvalResult(result);
    }
  };

  return (
    <div className="h-full bg-[#1e1e1e] border-l border-[#0000004d] flex flex-col">
      {/* Debug Panel Header */}
      <div className="h-6 bg-[#252526] border-b border-[#0000004d] flex items-center justify-between px-2">
        <span className="text-xs font-semibold text-gray-300">Debug</span>
        <div className="flex items-center gap-1">
          {!debugState.isRunning && !debugState.currentLine ? (
            <Button
              variant="ghost"
              size="xs"
              onClick={handleStartDebugging}
              title="Start Debugging"
              className="hover:bg-[#ffffff1a]"
            >
              <Play size={12} className="text-green-400" />
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="xs"
                onClick={handleStopDebugging}
                title="Stop Debugging"
                className="hover:bg-[#ffffff1a]"
              >
                <Square size={12} className="text-red-400" />
              </Button>
              {debugState.isRunning ? (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleStopDebugging}
                  title="Pause"
                  className="hover:bg-[#ffffff1a]"
                >
                  <Pause size={12} className="text-yellow-400" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleContinue}
                  title="Continue"
                  className="hover:bg-[#ffffff1a]"
                >
                  <Play size={12} className="text-green-400" />
                </Button>
              )}
              <Button
                variant="secondary"
                size="xs"
                onClick={handleStepOver}
                title="Step Over"
                disabled={debugState.isRunning}
              >
                <span className="text-xs text-blue-400 font-mono">→</span>
              </Button>
              <Button
                variant="secondary"
                size="xs"
                onClick={handleStepInto}
                title="Step Into"
                disabled={debugState.isRunning}
              >
                <span className="text-xs text-blue-400 font-mono">↓</span>
              </Button>
              <Button
                variant="secondary"
                size="xs"
                onClick={handleStepOut}
                title="Step Out"
                disabled={debugState.isRunning}
              >
                <span className="text-xs text-blue-400 font-mono">↑</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Debug Controls */}
      <div className="p-2 border-b border-[#0000004d]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-gray-400">Breakpoints:</span>
          <span className="text-xs text-gray-300">
            {debugState.breakpoints.length} active
          </span>
        </div>
        
        {/* Breakpoints List */}
        <div className="max-h-24 overflow-y-auto">
          {debugState.breakpoints.length > 0 ? (
            <ul className="space-y-1">
              {debugState.breakpoints.map((bp) => (
                <li 
                  key={bp.id} 
                  className="flex items-center justify-between text-xs p-1 hover:bg-[#2d2d2d] rounded"
                >
                  <span className="text-gray-300">
                    Line {bp.lineNumber}
                  </span>
                  <button
                    onClick={() => handleToggleBreakpoint(bp.lineNumber)}
                    className="p-1 rounded hover:bg-[#ffffff1a] transition-colors"
                    title={bp.enabled ? 'Disable breakpoint' : 'Enable breakpoint'}
                  >
                    {bp.enabled ? (
                      <Circle size={10} className="text-red-500" />
                    ) : (
                      <CircleOff size={10} className="text-gray-500" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500 italic">No breakpoints set</p>
          )}
        </div>
      </div>

      {/* Variables Panel */}
      <div className="flex-1 flex flex-col border-b border-[#0000004d]">
        <div className="p-1.5 bg-[#252526] border-b border-[#0000004d]">
          <span className="text-xs font-semibold text-gray-300">Variables</span>
        </div>
        <div className="flex-1 overflow-y-auto p-1.5">
          {debugState.variables.length > 0 ? (
            <ul className="space-y-1">
              {debugState.variables.map((variable, index) => (
                <li key={index} className="text-xs p-1 hover:bg-[#2d2d2d] rounded">
                  <div className="flex justify-between">
                    <span className="text-blue-400">{variable.name}</span>
                    <span className="text-gray-500">{variable.type}</span>
                  </div>
                  <div className="text-gray-300 font-mono truncate text-[10px]">{variable.value}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500 italic">No variables in scope</p>
          )}
        </div>
      </div>

      {/* Stack Frames */}
      <div className="flex-1 flex flex-col border-b border-[#0000004d]">
        <div className="p-1.5 bg-[#252526] border-b border-[#0000004d]">
          <span className="text-xs font-semibold text-gray-300">Call Stack</span>
        </div>
        <div className="flex-1 overflow-y-auto p-1.5">
          {debugState.stackFrames.length > 0 ? (
            <ul className="space-y-1">
              {debugState.stackFrames.map((frame) => (
                <li key={frame.id} className="text-xs p-1 hover:bg-[#2d2d2d] rounded">
                  <div className="font-mono text-blue-400">{frame.name}</div>
                  <div className="text-gray-400 truncate text-[10px]">{frame.filename}:{frame.line}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500 italic">No stack frames</p>
          )}
        </div>
      </div>

      {/* Expression Evaluator */}
      <div className="p-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-gray-400">Evaluate:</span>
        </div>
        <div className="flex gap-1">
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="Enter expression..."
            className="flex-1 bg-[#1e1e1e] text-[#cccccc] text-xs p-1 rounded border border-[#0000004d] focus:border-[#007acc] focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleEvaluate();
              }
            }}
          />
          <Button
            variant="primary"
            size="xs"
            onClick={handleEvaluate}
            disabled={!expression.trim()}
          >
            Eval
          </Button>
        </div>
        {evalResult && (
          <div className="mt-1 p-1.5 bg-[#1e1e1e] rounded text-xs font-mono text-gray-300 border border-[#0000004d]">
            {evalResult}
          </div>
        )}
      </div>
    </div>
  );
}