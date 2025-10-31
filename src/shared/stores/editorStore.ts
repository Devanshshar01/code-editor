import { create } from 'zustand';
import type { EditorState, EditorTab, FileNode } from '../types';
import { fileSystemService } from '../services/filesystem.service';
import type { ExecutionResult } from '../services/execution.service';

export type ActivityView = 'explorer' | 'search' | 'source-control' | 'debug' | 'extensions' | null;

interface EditorStore extends EditorState {
  setFiles: (files: FileNode[]) => void;
  setCurrentFile: (fileId: string | null) => void;
  openFile: (fileId: string) => void;
  closeTab: (tabId: string) => void;
  updateTabContent: (tabId: string, content: string) => void;
  saveFile: (fileId: string) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  setTheme: (theme: string) => void;
  loadFiles: () => void;
  isTerminalOpen: boolean;
  toggleTerminal: () => void;
  executionResult: ExecutionResult | null;
  setExecutionResult: (result: ExecutionResult | null) => void;
  isExecuting: boolean;
  setIsExecuting: (isExecuting: boolean) => void;
  monacoTheme: string;
  setMonacoTheme: (theme: string) => void;
  isPreviewOpen: boolean;
  togglePreview: () => void;
  // New state for VS Code features
  activeView: ActivityView;
  setActiveView: (view: ActivityView) => void;
  isCommandPaletteOpen: boolean;
  toggleCommandPalette: () => void;
  isSettingsOpen: boolean;
  toggleSettings: () => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  currentFileId: null,
  openTabs: [],
  files: [],
  isSidebarOpen: true,
  theme: 'dark',
  monacoTheme: 'vs-dark',
  isTerminalOpen: false,
  executionResult: null,
  isExecuting: false,
  isPreviewOpen: false,
  activeView: 'explorer' as ActivityView,
  isCommandPaletteOpen: false,
  isSettingsOpen: false,

  setFiles: (files) => set({ files }),

  setCurrentFile: (fileId) => set({ currentFileId: fileId }),

  openFile: (fileId) => {
    const { openTabs } = get();
    const existingTab = openTabs.find((tab) => tab.fileId === fileId);

    if (existingTab) {
      set({ currentFileId: fileId });
      return;
    }

    const file = fileSystemService.getFileById(fileId);
    if (!file || file.type !== 'file') return;

    const newTab: EditorTab = {
      id: fileId,
      fileId: fileId,
      fileName: file.name,
      content: file.content || '',
      language: file.language || 'plaintext',
      isDirty: false,
    };

    set({
      openTabs: [...openTabs, newTab],
      currentFileId: fileId,
    });
  },

  closeTab: (tabId) => {
    const { openTabs, currentFileId } = get();
    const newTabs = openTabs.filter((tab) => tab.id !== tabId);
    
    let newCurrentFileId = currentFileId;
    if (currentFileId === tabId) {
      newCurrentFileId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
    }

    set({
      openTabs: newTabs,
      currentFileId: newCurrentFileId,
    });
  },

  updateTabContent: (tabId, content) => {
    const { openTabs } = get();
    const newTabs = openTabs.map((tab) =>
      tab.id === tabId ? { ...tab, content, isDirty: true } : tab
    );
    set({ openTabs: newTabs });
  },

  saveFile: (fileId) => {
    const { openTabs } = get();
    const tab = openTabs.find((t) => t.id === fileId);
    if (!tab) return;

    fileSystemService.updateFileContent(fileId, tab.content);
    
    const newTabs = openTabs.map((t) =>
      t.id === fileId ? { ...t, isDirty: false } : t
    );
    set({ openTabs: newTabs });
  },

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'dark' ? 'light' : 'dark',
    monacoTheme: state.theme === 'dark' ? 'vs-light' : 'vs-dark'
  })),

  setTheme: (theme) => set({ theme: theme as 'light' | 'dark' }),

  setMonacoTheme: (monacoTheme) => set({ monacoTheme }),

  toggleTerminal: () => set((state) => ({ isTerminalOpen: !state.isTerminalOpen })),

  setExecutionResult: (executionResult) => set({ executionResult }),

  setIsExecuting: (isExecuting) => set({ isExecuting }),

  togglePreview: () => set((state) => ({ isPreviewOpen: !state.isPreviewOpen })),

  setActiveView: (view) => set({ activeView: view }),

  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),

  loadFiles: () => {
    const files = fileSystemService.getAllFiles();
    set({ files });
  },
}));
