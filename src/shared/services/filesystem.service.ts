import { nanoid } from 'nanoid';
import type { FileNode } from '../types';
import { getLanguageFromFilename } from '../utils';

const STORAGE_KEY = 'codecollab_files';

const DEFAULT_FILES: FileNode[] = [
  {
    id: nanoid(),
    name: 'src',
    type: 'folder',
    parentId: null,
    isExpanded: true,
    children: [
      {
        id: nanoid(),
        name: 'App.tsx',
        type: 'file',
        parentId: 'src',
        language: 'typescript',
        content: `import React from 'react';

function App() {
  return (
    <div className="App">
      <h1>Welcome to CodeCollab!</h1>
      <p>Start editing to see live updates.</p>
    </div>
  );
}

export default App;`,
      },
      {
        id: nanoid(),
        name: 'index.css',
        type: 'file',
        parentId: 'src',
        language: 'css',
        content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`,
      },
    ],
  },
  {
    id: nanoid(),
    name: 'index.html',
    type: 'file',
    parentId: null,
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello CodeCollab</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        h1 {
            font-size: 3rem;
            margin: 0 0 1rem 0;
        }
        p {
            font-size: 1.2rem;
            margin: 0;
        }
        button {
            margin-top: 1rem;
            padding: 0.8rem 2rem;
            font-size: 1rem;
            background: white;
            color: #667eea;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            font-weight: bold;
        }
        button:hover {
            transform: scale(1.05);
            transition: transform 0.2s;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 Hello, CodeCollab!</h1>
        <p>Your code editor with live preview</p>
        <button onclick="alert('Welcome to CodeCollab! Edit this HTML to see live changes.')">Click Me</button>
    </div>
</body>
</html>`,
  },
  {
    id: nanoid(),
    name: 'README.md',
    type: 'file',
    parentId: null,
    language: 'markdown',
    content: `# CodeCollab

A real-time collaborative code editor built with React, TypeScript, and Monaco Editor.

## Features

- 📝 Full Monaco Editor integration
- 🌙 Dark mode support
- 💾 Auto-save functionality
- 🎨 Syntax highlighting for 15+ languages
- ⌨️ Keyboard shortcuts
- 🎬 Live HTML preview
- 🖥️ Code execution with stdin support

## Getting Started

1. Open any file from the explorer
2. Start editing
3. Changes auto-save every 3 seconds
4. For HTML files, click the Eye icon for live preview
5. For code execution, select language and click Run

Enjoy coding!`,
  },
];

class FileSystemService {
  private getFiles(): FileNode[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load files:', error);
    }
    return this.initializeDefault();
  }

  private initializeDefault(): FileNode[] {
    this.saveFiles(DEFAULT_FILES);
    return DEFAULT_FILES;
  }

  private saveFiles(files: FileNode[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    } catch (error) {
      console.error('Failed to save files:', error);
    }
  }

  getAllFiles(): FileNode[] {
    return this.getFiles();
  }

  getFileById(id: string): FileNode | null {
    const files = this.getFiles();
    const findFile = (nodes: FileNode[]): FileNode | null => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = findFile(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findFile(files);
  }

  createFile(name: string, parentId: string | null): FileNode {
    const files = this.getFiles();
    const newFile: FileNode = {
      id: nanoid(),
      name,
      type: 'file',
      parentId,
      language: getLanguageFromFilename(name),
      content: '',
    };

    if (parentId) {
      const addToParent = (nodes: FileNode[]): boolean => {
        for (const node of nodes) {
          if (node.id === parentId && node.type === 'folder') {
            if (!node.children) node.children = [];
            node.children.push(newFile);
            return true;
          }
          if (node.children && addToParent(node.children)) return true;
        }
        return false;
      };
      addToParent(files);
    } else {
      files.push(newFile);
    }

    this.saveFiles(files);
    return newFile;
  }

  createFolder(name: string, parentId: string | null): FileNode {
    const files = this.getFiles();
    const newFolder: FileNode = {
      id: nanoid(),
      name,
      type: 'folder',
      parentId,
      children: [],
      isExpanded: false,
    };

    if (parentId) {
      const addToParent = (nodes: FileNode[]): boolean => {
        for (const node of nodes) {
          if (node.id === parentId && node.type === 'folder') {
            if (!node.children) node.children = [];
            node.children.push(newFolder);
            return true;
          }
          if (node.children && addToParent(node.children)) return true;
        }
        return false;
      };
      addToParent(files);
    } else {
      files.push(newFolder);
    }

    this.saveFiles(files);
    return newFolder;
  }

  updateFileContent(id: string, content: string): void {
    const files = this.getFiles();
    const updateContent = (nodes: FileNode[]): boolean => {
      for (const node of nodes) {
        if (node.id === id) {
          node.content = content;
          return true;
        }
        if (node.children && updateContent(node.children)) return true;
      }
      return false;
    };
    updateContent(files);
    this.saveFiles(files);
  }

  renameFile(id: string, newName: string): void {
    const files = this.getFiles();
    const rename = (nodes: FileNode[]): boolean => {
      for (const node of nodes) {
        if (node.id === id) {
          node.name = newName;
          if (node.type === 'file') {
            node.language = getLanguageFromFilename(newName);
          }
          return true;
        }
        if (node.children && rename(node.children)) return true;
      }
      return false;
    };
    rename(files);
    this.saveFiles(files);
  }

  deleteFile(id: string): void {
    const files = this.getFiles();
    const deleteNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.filter((node) => {
        if (node.id === id) return false;
        if (node.children) {
          node.children = deleteNode(node.children);
        }
        return true;
      });
    };
    const updated = deleteNode(files);
    this.saveFiles(updated);
  }

  toggleFolder(id: string): void {
    const files = this.getFiles();
    const toggle = (nodes: FileNode[]): boolean => {
      for (const node of nodes) {
        if (node.id === id && node.type === 'folder') {
          node.isExpanded = !node.isExpanded;
          return true;
        }
        if (node.children && toggle(node.children)) return true;
      }
      return false;
    };
    toggle(files);
    this.saveFiles(files);
  }
}

export const fileSystemService = new FileSystemService();
