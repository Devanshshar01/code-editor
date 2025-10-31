import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, ChevronRight, FileText, Settings, Terminal, GitBranch, Package } from 'lucide-react';
import { cn } from '../../utils';

interface Command {
  id: string;
  title: string;
  category?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands?: Command[];
}

const defaultCommands: Command[] = [
  {
    id: 'file.new',
    title: 'New File',
    category: 'File',
    icon: FileText,
    shortcut: 'Ctrl+N',
    action: () => console.log('New file'),
  },
  {
    id: 'file.open',
    title: 'Open File...',
    category: 'File',
    icon: FileText,
    shortcut: 'Ctrl+O',
    action: () => console.log('Open file'),
  },
  {
    id: 'file.save',
    title: 'Save',
    category: 'File',
    shortcut: 'Ctrl+S',
    action: () => console.log('Save file'),
  },
  {
    id: 'file.saveAll',
    title: 'Save All',
    category: 'File',
    shortcut: 'Ctrl+Shift+S',
    action: () => console.log('Save all files'),
  },
  {
    id: 'view.terminal',
    title: 'Toggle Terminal',
    category: 'View',
    icon: Terminal,
    shortcut: 'Ctrl+`',
    action: () => console.log('Toggle terminal'),
  },
  {
    id: 'view.explorer',
    title: 'Show Explorer',
    category: 'View',
    shortcut: 'Ctrl+Shift+E',
    action: () => console.log('Show explorer'),
  },
  {
    id: 'view.search',
    title: 'Show Search',
    category: 'View',
    shortcut: 'Ctrl+Shift+F',
    action: () => console.log('Show search'),
  },
  {
    id: 'view.scm',
    title: 'Show Source Control',
    category: 'View',
    icon: GitBranch,
    shortcut: 'Ctrl+Shift+G',
    action: () => console.log('Show source control'),
  },
  {
    id: 'view.extensions',
    title: 'Show Extensions',
    category: 'View',
    icon: Package,
    shortcut: 'Ctrl+Shift+X',
    action: () => console.log('Show extensions'),
  },
  {
    id: 'preferences.settings',
    title: 'Preferences: Open Settings',
    icon: Settings,
    shortcut: 'Ctrl+,',
    action: () => console.log('Open settings'),
  },
  {
    id: 'preferences.theme',
    title: 'Preferences: Color Theme',
    action: () => console.log('Open theme picker'),
  },
  {
    id: 'editor.format',
    title: 'Format Document',
    category: 'Editor',
    shortcut: 'Shift+Alt+F',
    action: () => console.log('Format document'),
  },
  {
    id: 'editor.findReplace',
    title: 'Find and Replace',
    category: 'Editor',
    shortcut: 'Ctrl+H',
    action: () => console.log('Find and replace'),
  },
];

export function CommandPalette({ isOpen, onClose, commands = defaultCommands }: CommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter commands based on search query
  const filteredCommands = useMemo(() => {
    if (!searchQuery) return commands;
    
    const query = searchQuery.toLowerCase();
    return commands.filter(cmd => 
      cmd.title.toLowerCase().includes(query) ||
      cmd.category?.toLowerCase().includes(query)
    );
  }, [searchQuery, commands]);

  // Reset selection when filtered results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const items = listRef.current.getElementsByClassName('command-item');
      const selectedItem = items[selectedIndex] as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Command Palette */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[600px] max-h-[400px] bg-[#252526] rounded-md shadow-2xl border border-[#1e1e1e] z-50 flex flex-col">
        {/* Search input */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[#1e1e1e]">
          <Search size={16} className="text-[#858585]" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-[#cccccc] placeholder-[#858585] focus:outline-none"
          />
        </div>

        {/* Commands list */}
        <div ref={listRef} className="flex-1 overflow-auto py-1">
          {filteredCommands.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-[#858585]">
              No matching commands
            </div>
          ) : (
            filteredCommands.map((cmd, index) => {
              const Icon = cmd.icon;
              const isSelected = index === selectedIndex;
              
              return (
                <div
                  key={cmd.id}
                  className={cn(
                    'command-item flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors',
                    isSelected ? 'bg-[#094771]' : 'hover:bg-[#2a2d2e]'
                  )}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {/* Icon */}
                  {Icon ? (
                    <Icon size={16} className="text-[#858585] flex-shrink-0" />
                  ) : (
                    <div className="w-4" />
                  )}

                  {/* Title and category */}
                  <div className="flex-1 flex items-center gap-2">
                    {cmd.category && (
                      <>
                        <span className="text-xs text-[#858585]">{cmd.category}</span>
                        <ChevronRight size={12} className="text-[#858585]" />
                      </>
                    )}
                    <span className="text-sm text-[#cccccc]">{cmd.title}</span>
                  </div>

                  {/* Shortcut */}
                  {cmd.shortcut && (
                    <kbd className="text-xs text-[#858585] bg-[#1e1e1e] px-1.5 py-0.5 rounded">
                      {cmd.shortcut}
                    </kbd>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer hint */}
        <div className="px-3 py-2 border-t border-[#1e1e1e] text-xs text-[#858585]">
          <span>↑↓ Navigate</span>
          <span className="mx-2">·</span>
          <span>↵ Select</span>
          <span className="mx-2">·</span>
          <span>Esc Cancel</span>
        </div>
      </div>
    </>
  );
}
