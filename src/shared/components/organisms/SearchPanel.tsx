import { useState, useCallback } from 'react';
import { X, ChevronRight, ChevronDown, FileText, Replace, CaseSensitive, WholeWord, Regex } from 'lucide-react';
import { cn } from '../../utils';

interface SearchResult {
  file: string;
  line: number;
  column: number;
  match: string;
  context: string;
}

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchPanel({ isOpen, onClose }: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isReplaceMode, setIsReplaceMode] = useState(false);
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  
  // Search options
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [isWholeWord, setIsWholeWord] = useState(false);
  const [isRegex, setIsRegex] = useState(false);

  const handleSearch = useCallback(() => {
    // Simulate search results for demonstration
    if (searchQuery) {
      const mockResults: SearchResult[] = [
        {
          file: 'src/App.tsx',
          line: 15,
          column: 10,
          match: searchQuery,
          context: `  const { ${searchQuery}, toggleSidebar } = useEditorStore();`
        },
        {
          file: 'src/components/Header.tsx',
          line: 23,
          column: 5,
          match: searchQuery,
          context: `    ${searchQuery}: string;`
        }
      ];
      setSearchResults(mockResults);
      // Auto-expand all files with results
      setExpandedFiles(new Set(mockResults.map(r => r.file)));
    } else {
      setSearchResults([]);
      setExpandedFiles(new Set());
    }
  }, [searchQuery]);

  const toggleFileExpanded = (file: string) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(file)) {
      newExpanded.delete(file);
    } else {
      newExpanded.add(file);
    }
    setExpandedFiles(newExpanded);
  };

  // Group results by file
  const resultsByFile = searchResults.reduce((acc, result) => {
    if (!acc[result.file]) {
      acc[result.file] = [];
    }
    acc[result.file].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-[#252526] border-r border-[#1e1e1e] flex flex-col h-full">
      {/* Header */}
      <div className="h-9 bg-[#252526] border-b border-[#1e1e1e] flex items-center justify-between px-3">
        <span className="text-xs font-medium text-[#cccccc] uppercase tracking-wider">Search</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#2a2d2e] rounded transition-colors"
          aria-label="Close search"
        >
          <X size={14} className="text-[#cccccc]" />
        </button>
      </div>

      {/* Search inputs */}
      <div className="p-3 space-y-2">
        {/* Search input */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsReplaceMode(!isReplaceMode)}
            className="p-1 hover:bg-[#2a2d2e] rounded transition-colors"
            title="Toggle Replace"
          >
            {isReplaceMode ? (
              <ChevronDown size={14} className="text-[#cccccc]" />
            ) : (
              <ChevronRight size={14} className="text-[#cccccc]" />
            )}
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search"
              className="w-full bg-[#3c3c3c] text-[#cccccc] text-xs px-2 py-1 pr-20 rounded border border-[#1e1e1e] focus:border-[#007acc] focus:outline-none"
            />
            {/* Search options */}
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
              <button
                onClick={() => setIsCaseSensitive(!isCaseSensitive)}
                className={cn(
                  'p-0.5 rounded transition-colors',
                  isCaseSensitive ? 'bg-[#007acc] text-white' : 'hover:bg-[#2a2d2e] text-[#858585]'
                )}
                title="Match Case"
              >
                <CaseSensitive size={14} />
              </button>
              <button
                onClick={() => setIsWholeWord(!isWholeWord)}
                className={cn(
                  'p-0.5 rounded transition-colors',
                  isWholeWord ? 'bg-[#007acc] text-white' : 'hover:bg-[#2a2d2e] text-[#858585]'
                )}
                title="Match Whole Word"
              >
                <WholeWord size={14} />
              </button>
              <button
                onClick={() => setIsRegex(!isRegex)}
                className={cn(
                  'p-0.5 rounded transition-colors',
                  isRegex ? 'bg-[#007acc] text-white' : 'hover:bg-[#2a2d2e] text-[#858585]'
                )}
                title="Use Regular Expression"
              >
                <Regex size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Replace input (shown when in replace mode) */}
        {isReplaceMode && (
          <div className="flex items-center gap-1">
            <div className="w-[18px]" /> {/* Spacer to align with search input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={replaceQuery}
                onChange={(e) => setReplaceQuery(e.target.value)}
                placeholder="Replace"
                className="w-full bg-[#3c3c3c] text-[#cccccc] text-xs px-2 py-1 rounded border border-[#1e1e1e] focus:border-[#007acc] focus:outline-none"
              />
              <button
                className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs hover:bg-[#2a2d2e] rounded transition-colors text-[#858585]"
                title="Replace All"
              >
                <Replace size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Include/Exclude patterns */}
        <details className="text-xs">
          <summary className="cursor-pointer text-[#858585] hover:text-[#cccccc]">
            files to include/exclude
          </summary>
          <div className="mt-2 space-y-1">
            <input
              type="text"
              placeholder="files to include"
              className="w-full bg-[#3c3c3c] text-[#cccccc] text-xs px-2 py-1 rounded border border-[#1e1e1e] focus:border-[#007acc] focus:outline-none"
            />
            <input
              type="text"
              placeholder="files to exclude"
              className="w-full bg-[#3c3c3c] text-[#cccccc] text-xs px-2 py-1 rounded border border-[#1e1e1e] focus:border-[#007acc] focus:outline-none"
            />
          </div>
        </details>
      </div>

      {/* Search results */}
      <div className="flex-1 overflow-auto">
        {searchResults.length > 0 && (
          <div className="text-xs text-[#858585] px-3 py-1 border-b border-[#1e1e1e]">
            {searchResults.length} results in {Object.keys(resultsByFile).length} files
          </div>
        )}
        
        {/* Results grouped by file */}
        <div className="text-xs">
          {Object.entries(resultsByFile).map(([file, results]) => (
            <div key={file}>
              <div
                className="flex items-center gap-1 px-2 py-1 hover:bg-[#2a2d2e] cursor-pointer"
                onClick={() => toggleFileExpanded(file)}
              >
                <span className="flex-shrink-0">
                  {expandedFiles.has(file) ? (
                    <ChevronDown size={12} className="text-[#858585]" />
                  ) : (
                    <ChevronRight size={12} className="text-[#858585]" />
                  )}
                </span>
                <FileText size={12} className="flex-shrink-0 text-[#519aba]" />
                <span className="text-[#cccccc] truncate">{file}</span>
                <span className="text-[#858585] ml-auto">({results.length})</span>
              </div>
              
              {expandedFiles.has(file) && (
                <div className="ml-6">
                  {results.map((result, idx) => (
                    <div
                      key={idx}
                      className="px-2 py-1 hover:bg-[#2a2d2e] cursor-pointer text-[#cccccc]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#858585]">{result.line}:{result.column}</span>
                        <span className="truncate">{result.context}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {searchQuery && searchResults.length === 0 && (
          <div className="text-xs text-[#858585] text-center py-8">
            No results found for '{searchQuery}'
          </div>
        )}

        {!searchQuery && (
          <div className="text-xs text-[#858585] text-center py-8">
            Type to search across all files
          </div>
        )}
      </div>
    </div>
  );
}
