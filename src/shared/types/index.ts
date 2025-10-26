export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  parentId: string | null;
  children?: FileNode[];
  isExpanded?: boolean;
}

export interface EditorTab {
  id: string;
  fileId: string;
  fileName: string;
  content: string;
  language: string;
  isDirty: boolean;
}

export interface EditorState {
  currentFileId: string | null;
  openTabs: EditorTab[];
  files: FileNode[];
  isSidebarOpen: boolean;
  theme: 'light' | 'dark';
}

export interface CursorPosition {
  userId: string;
  userName: string;
  line: number;
  column: number;
  color: string;
}

export interface CollaborationState {
  sessionId: string | null;
  participants: User[];
  cursors: CursorPosition[];
  isConnected: boolean;
}

export type Language = 
  | 'javascript' | 'typescript' | 'python' | 'html' | 'css' 
  | 'json' | 'markdown' | 'java' | 'cpp' | 'c' | 'go' 
  | 'rust' | 'php' | 'ruby' | 'sql' | 'shell' | 'plaintext';
