import { useState } from 'react';
import { 
  Package, 
  Search, 
  X, 
  Download, 
  Star, 
  TrendingUp,
  Check,
  Settings,
  Filter
} from 'lucide-react';
import { cn } from '../../utils';

interface Extension {
  id: string;
  name: string;
  displayName: string;
  publisher: string;
  description: string;
  version: string;
  downloads: string;
  rating: number;
  installed: boolean;
  verified: boolean;
}

interface ExtensionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const popularExtensions: Extension[] = [
  {
    id: 'python',
    name: 'python',
    displayName: 'Python',
    publisher: 'Microsoft',
    description: 'IntelliSense (Pylance), Linting, Debugging, Jupyter Notebooks, code formatting, refactoring',
    version: '2024.0.0',
    downloads: '92.3M',
    rating: 4.5,
    installed: true,
    verified: true,
  },
  {
    id: 'prettier',
    name: 'prettier-vscode',
    displayName: 'Prettier - Code formatter',
    publisher: 'Prettier',
    description: 'Code formatter using prettier',
    version: '10.1.0',
    downloads: '38.5M',
    rating: 4.0,
    installed: true,
    verified: true,
  },
  {
    id: 'eslint',
    name: 'eslint',
    displayName: 'ESLint',
    publisher: 'Microsoft',
    description: 'Integrates ESLint JavaScript into VS Code',
    version: '2.4.2',
    downloads: '35.2M',
    rating: 4.5,
    installed: false,
    verified: true,
  },
  {
    id: 'gitlens',
    name: 'gitlens',
    displayName: 'GitLens — Git supercharged',
    publisher: 'GitKraken',
    description: 'Supercharge Git within VS Code',
    version: '14.5.1',
    downloads: '26.8M',
    rating: 4.8,
    installed: false,
    verified: true,
  },
];

export function ExtensionsPanel({ isOpen, onClose }: ExtensionsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'marketplace' | 'installed'>('marketplace');
  
  const filteredExtensions = popularExtensions.filter(ext => {
    if (activeTab === 'installed' && !ext.installed) return false;
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return ext.displayName.toLowerCase().includes(query) ||
           ext.description.toLowerCase().includes(query) ||
           ext.publisher.toLowerCase().includes(query);
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={10}
            className={cn(
              star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-[#3c3c3c]'
            )}
          />
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-[#252526] border-r border-[#1e1e1e] flex flex-col h-full">
      {/* Header */}
      <div className="h-9 bg-[#252526] border-b border-[#1e1e1e] flex items-center justify-between px-3">
        <span className="text-xs font-medium text-[#cccccc] uppercase tracking-wider">Extensions</span>
        <div className="flex items-center gap-1">
          <button
            className="p-1 hover:bg-[#2a2d2e] rounded transition-colors"
            title="Filter Extensions"
          >
            <Filter size={14} className="text-[#cccccc]" />
          </button>
          <button
            className="p-1 hover:bg-[#2a2d2e] rounded transition-colors"
            title="Extensions Settings"
          >
            <Settings size={14} className="text-[#cccccc]" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#2a2d2e] rounded transition-colors"
            aria-label="Close extensions"
          >
            <X size={14} className="text-[#cccccc]" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-[#1e1e1e]">
        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#858585]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Extensions in Marketplace"
            className="w-full bg-[#3c3c3c] text-[#cccccc] text-xs pl-7 pr-2 py-1.5 rounded border border-[#1e1e1e] focus:border-[#007acc] focus:outline-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1e1e1e]">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={cn(
            'flex-1 px-3 py-2 text-xs transition-colors',
            activeTab === 'marketplace' 
              ? 'text-[#cccccc] border-b-2 border-[#007acc]' 
              : 'text-[#858585] hover:text-[#cccccc]'
          )}
        >
          <TrendingUp size={12} className="inline mr-1" />
          Marketplace
        </button>
        <button
          onClick={() => setActiveTab('installed')}
          className={cn(
            'flex-1 px-3 py-2 text-xs transition-colors',
            activeTab === 'installed' 
              ? 'text-[#cccccc] border-b-2 border-[#007acc]' 
              : 'text-[#858585] hover:text-[#cccccc]'
          )}
        >
          <Package size={12} className="inline mr-1" />
          Installed ({popularExtensions.filter(e => e.installed).length})
        </button>
      </div>

      {/* Extensions List */}
      <div className="flex-1 overflow-auto">
        {filteredExtensions.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#858585]">
            {searchQuery ? `No extensions found for "${searchQuery}"` : 'No extensions found'}
          </div>
        ) : (
          <div className="divide-y divide-[#1e1e1e]">
            {filteredExtensions.map((ext) => (
              <div
                key={ext.id}
                className="p-3 hover:bg-[#2a2d2e] transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  {/* Extension Icon */}
                  <div className="w-10 h-10 bg-[#3c3c3c] rounded flex items-center justify-center flex-shrink-0">
                    <Package size={20} className="text-[#007acc]" />
                  </div>

                  {/* Extension Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-[#cccccc] font-medium truncate">
                        {ext.displayName}
                      </span>
                      {ext.verified && (
                        <Check size={12} className="text-[#007acc] flex-shrink-0" />
                      )}
                    </div>
                    
                    <div className="text-xs text-[#858585] mb-1">
                      {ext.publisher} · v{ext.version}
                    </div>
                    
                    <div className="text-xs text-[#cccccc] line-clamp-2 mb-2">
                      {ext.description}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {renderStars(ext.rating)}
                      <div className="flex items-center gap-1 text-xs text-[#858585]">
                        <Download size={10} />
                        <span>{ext.downloads}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    className={cn(
                      'px-3 py-1 rounded text-xs transition-colors flex-shrink-0',
                      ext.installed
                        ? 'bg-[#1e1e1e] text-[#858585]'
                        : 'bg-[#007acc] hover:bg-[#005a9e] text-white'
                    )}
                  >
                    {ext.installed ? 'Installed' : 'Install'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-[#1e1e1e] text-xs text-[#858585]">
        <div className="flex items-center justify-between">
          <span>Extensions are powered by the VS Code Marketplace</span>
        </div>
      </div>
    </div>
  );
}
