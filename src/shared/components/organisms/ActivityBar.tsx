import React from 'react';
import { 
  Files, 
  Search, 
  GitBranch, 
  Package, 
  Settings,
  User,
  Play
} from 'lucide-react';
import { cn } from '../../utils';

export type ActivityView = 
  | 'explorer' 
  | 'search' 
  | 'source-control' 
  | 'debug' 
  | 'extensions'
  | null;

interface ActivityBarProps {
  activeView: ActivityView;
  onViewChange: (view: ActivityView) => void;
  showSettings?: boolean;
  onSettingsClick?: () => void;
}

interface ActivityItem {
  id: ActivityView;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  shortcut?: string;
}

const activities: ActivityItem[] = [
  { id: 'explorer', icon: Files, label: 'Explorer', shortcut: 'Ctrl+Shift+E' },
  { id: 'search', icon: Search, label: 'Search', shortcut: 'Ctrl+Shift+F' },
  { id: 'source-control', icon: GitBranch, label: 'Source Control', shortcut: 'Ctrl+Shift+G' },
  { id: 'debug', icon: Play, label: 'Run and Debug', shortcut: 'Ctrl+Shift+D' },
  { id: 'extensions', icon: Package, label: 'Extensions', shortcut: 'Ctrl+Shift+X' },
];

export function ActivityBar({ 
  activeView, 
  onViewChange, 
  showSettings = true, 
  onSettingsClick 
}: ActivityBarProps) {
  const handleActivityClick = (view: ActivityView) => {
    // Toggle the view if it's already active
    if (activeView === view) {
      onViewChange(null);
    } else {
      onViewChange(view);
    }
  };

  return (
    <div className="w-12 bg-[#333333] flex flex-col items-center py-2 border-r border-[#1e1e1e]">
      {/* Top activities */}
      <div className="flex flex-col items-center gap-1 flex-1">
        {activities.map((activity) => {
          const Icon = activity.icon;
          const isActive = activeView === activity.id;
          
          return (
            <button
              key={activity.id}
              onClick={() => handleActivityClick(activity.id)}
              className={cn(
                'relative w-12 h-12 flex items-center justify-center transition-all',
                'hover:bg-[#2a2a2a]',
                isActive && 'text-white'
              )}
              title={`${activity.label} (${activity.shortcut})`}
              aria-label={activity.label}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white" />
              )}
              
              <Icon 
                size={24} 
                className={cn(
                  'transition-colors',
                  isActive ? 'text-white' : 'text-[#858585]'
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Bottom section */}
      <div className="flex flex-col items-center gap-1">
        {/* User Account */}
        <button
          className="w-12 h-12 flex items-center justify-center hover:bg-[#2a2a2a] transition-colors"
          title="Account"
          aria-label="Account"
        >
          <User size={24} className="text-[#858585]" />
        </button>

        {/* Settings */}
        {showSettings && (
          <button
            onClick={onSettingsClick}
            className="w-12 h-12 flex items-center justify-center hover:bg-[#2a2a2a] transition-colors"
            title="Settings (Ctrl+,)"
            aria-label="Settings"
          >
            <Settings size={24} className="text-[#858585]" />
          </button>
        )}
      </div>
    </div>
  );
}
