import { useState } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  RefreshCw, 
  MoreVertical, 
  X,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  FilePlus,
  FileX,
  FileDiff
} from 'lucide-react';
import { cn } from '../../utils';

interface GitChange {
  file: string;
  status: 'modified' | 'added' | 'deleted' | 'renamed';
  staged: boolean;
}

interface SourceControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SourceControlPanel({ isOpen, onClose }: SourceControlPanelProps) {
  const [commitMessage, setCommitMessage] = useState('');
  const [currentBranch] = useState('main');
  const [changes] = useState<GitChange[]>([
    { file: 'src/App.tsx', status: 'modified', staged: false },
    { file: 'src/components/Header.tsx', status: 'modified', staged: true },
    { file: 'src/styles/new.css', status: 'added', staged: false },
    { file: 'old-file.js', status: 'deleted', staged: false },
  ]);
  const [expandedSections, setExpandedSections] = useState({
    staged: true,
    changes: true,
  });

  const stagedChanges = changes.filter(c => c.staged);
  const unstagedChanges = changes.filter(c => !c.staged);

  const toggleSection = (section: 'staged' | 'changes') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getStatusIcon = (status: GitChange['status']) => {
    switch (status) {
      case 'modified':
        return <FileDiff size={14} className="text-yellow-600" />;
      case 'added':
        return <FilePlus size={14} className="text-green-600" />;
      case 'deleted':
        return <FileX size={14} className="text-red-600" />;
      case 'renamed':
        return <FileDiff size={14} className="text-blue-600" />;
    }
  };

  const getStatusLabel = (status: GitChange['status']) => {
    switch (status) {
      case 'modified': return 'M';
      case 'added': return 'A';
      case 'deleted': return 'D';
      case 'renamed': return 'R';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-[#252526] border-r border-[#1e1e1e] flex flex-col h-full">
      {/* Header */}
      <div className="h-9 bg-[#252526] border-b border-[#1e1e1e] flex items-center justify-between px-3">
        <span className="text-xs font-medium text-[#cccccc] uppercase tracking-wider">Source Control</span>
        <div className="flex items-center gap-1">
          <button
            className="p-1 hover:bg-[#2a2d2e] rounded transition-colors"
            title="Refresh"
          >
            <RefreshCw size={14} className="text-[#cccccc]" />
          </button>
          <button
            className="p-1 hover:bg-[#2a2d2e] rounded transition-colors"
            title="More Actions"
          >
            <MoreVertical size={14} className="text-[#cccccc]" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#2a2d2e] rounded transition-colors"
            aria-label="Close source control"
          >
            <X size={14} className="text-[#cccccc]" />
          </button>
        </div>
      </div>

      {/* Repository info */}
      <div className="px-3 py-2 border-b border-[#1e1e1e]">
        <div className="flex items-center gap-2">
          <GitBranch size={14} className="text-[#858585]" />
          <span className="text-xs text-[#cccccc]">{currentBranch}</span>
          <button className="ml-auto text-xs text-[#007acc] hover:underline">
            Publish Branch
          </button>
        </div>
      </div>

      {/* Commit section */}
      <div className="px-3 py-2 border-b border-[#1e1e1e]">
        <textarea
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          placeholder="Message (Ctrl+Enter to commit)"
          className="w-full h-20 bg-[#3c3c3c] text-[#cccccc] text-xs p-2 rounded border border-[#1e1e1e] focus:border-[#007acc] focus:outline-none resize-none"
        />
        <div className="mt-2 flex gap-2">
          <button
            className={cn(
              'flex-1 flex items-center justify-center gap-1 px-3 py-1 rounded text-xs transition-colors',
              commitMessage 
                ? 'bg-[#007acc] hover:bg-[#005a9e] text-white' 
                : 'bg-[#3c3c3c] text-[#858585] cursor-not-allowed'
            )}
            disabled={!commitMessage}
          >
            <Check size={12} />
            Commit
          </button>
          <button
            className="px-3 py-1 rounded text-xs bg-[#3c3c3c] hover:bg-[#2a2d2e] text-[#cccccc] transition-colors"
            title="Commit and Push"
          >
            <GitCommit size={12} />
          </button>
          <button
            className="px-3 py-1 rounded text-xs bg-[#3c3c3c] hover:bg-[#2a2d2e] text-[#cccccc] transition-colors"
            title="Commit and Sync"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* Changes sections */}
      <div className="flex-1 overflow-auto">
        {/* Staged Changes */}
        {stagedChanges.length > 0 && (
          <div>
            <div
              className="flex items-center gap-1 px-2 py-1 hover:bg-[#2a2d2e] cursor-pointer sticky top-0 bg-[#252526] z-10"
              onClick={() => toggleSection('staged')}
            >
              <span className="flex-shrink-0">
                {expandedSections.staged ? (
                  <ChevronDown size={12} className="text-[#858585]" />
                ) : (
                  <ChevronRight size={12} className="text-[#858585]" />
                )}
              </span>
              <span className="text-xs font-medium text-[#cccccc]">Staged Changes</span>
              <span className="text-xs text-[#858585] ml-auto">{stagedChanges.length}</span>
            </div>
            
            {expandedSections.staged && (
              <div>
                {stagedChanges.map((change, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-6 py-1 hover:bg-[#2a2d2e] cursor-pointer text-xs"
                  >
                    {getStatusIcon(change.status)}
                    <span className="text-[#cccccc] flex-1 truncate">{change.file}</span>
                    <span className="text-[#858585] bg-[#1e1e1e] px-1 rounded">
                      {getStatusLabel(change.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Unstaged Changes */}
        {unstagedChanges.length > 0 && (
          <div>
            <div
              className="flex items-center gap-1 px-2 py-1 hover:bg-[#2a2d2e] cursor-pointer sticky top-0 bg-[#252526] z-10"
              onClick={() => toggleSection('changes')}
            >
              <span className="flex-shrink-0">
                {expandedSections.changes ? (
                  <ChevronDown size={12} className="text-[#858585]" />
                ) : (
                  <ChevronRight size={12} className="text-[#858585]" />
                )}
              </span>
              <span className="text-xs font-medium text-[#cccccc]">Changes</span>
              <span className="text-xs text-[#858585] ml-auto">{unstagedChanges.length}</span>
            </div>
            
            {expandedSections.changes && (
              <div>
                {unstagedChanges.map((change, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-6 py-1 hover:bg-[#2a2d2e] cursor-pointer text-xs"
                  >
                    {getStatusIcon(change.status)}
                    <span className="text-[#cccccc] flex-1 truncate">{change.file}</span>
                    <span className="text-[#858585] bg-[#1e1e1e] px-1 rounded">
                      {getStatusLabel(change.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {changes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle size={32} className="text-[#858585] mb-3" />
            <div className="text-sm text-[#cccccc] mb-1">No changes</div>
            <div className="text-xs text-[#858585]">
              There are no changes in your workspace.
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="px-3 py-2 border-t border-[#1e1e1e] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <GitPullRequest size={12} className="text-[#858585]" />
          <span className="text-[#858585]">0↓ 0↑</span>
        </div>
        <button className="text-[#007acc] hover:underline">Sync Changes</button>
      </div>
    </div>
  );
}
